# Deepen Extension — Production Architecture

> Roadmap for making the browser extension a reliable, production-grade content capture pipeline for AI ingestion.

All work targets `extension/lnkd/` (Plasmo + React + TypeScript).

---

## Current State

**What works:**
- Plasmo-based Chrome MV3 extension with React popup
- Content script clones the DOM, strips noise elements, runs `@mozilla/readability`, falls back to semantic selectors (`main`, `article`, `[role='main']`)
- Extracts: plain text, metadata (title, OG tags, author, keywords), headings, links
- Sends JSON to backend via `PLASMO_PUBLIC_API_URL` env var (localhost in dev, Render in prod)
- Better Auth client initialized with correct env var, but not wired into capture flow
- Handles 409 (duplicate) and 401 (redirect to login) responses
- Environment-aware: `.env.development` and `.env.production` with separate API/app URLs

**What's missing:**
- No SPA/dynamic content handling — captures whatever is in the DOM at `document_end`
- Plain text only — all document structure (headings, lists, tables, code) is flattened
- Auth client exists but popup never checks session before capture
- No background service worker
- No selection capture (commented out)
- No keyboard shortcut handler (UI hint exists, no implementation)
- No offline resilience — failed captures are silently lost
- PDF detection returns empty string

---

## Feature Roadmap

Ordered by impact. Each feature is a self-contained unit of work.

---

### F1: SPA & Dynamic Content Awareness

**Problem:** Content script runs once at `document_end`. On SPAs (React, Next.js, Twitter/X, YouTube), the meaningful content loads asynchronously after the initial HTML shell. We often capture a loading spinner or empty `<div id="root">`.

**Solution:**

Create `src/lib/contentReady.ts`:

- **MutationObserver-based stability detection:** After `document_end`, observe `document.body` for mutations. Track mutations over a sliding 500ms window. When the mutation rate drops below a threshold, the DOM is "settled" and ready for extraction.
- **Hard timeout:** Cap the wait at 8 seconds — never hang indefinitely.
- **Lazy-load trigger:** Before extraction, programmatically scroll through the main content area to fire `IntersectionObserver`-based lazy loaders, then wait for the DOM to re-settle.

Update `content.tsx`:
- The `extractPageData` message handler should `await waitForContentReady()` before running the extraction pipeline.

**Why this matters:** Without this, the extension is essentially broken on any modern SPA — which is most of the web.

---

### F2: Structured Output — Markdown Instead of Plain Text

**Problem:** We send `mainText` as flattened plain text. The AI pipeline loses all document structure — headings, lists, tables, code blocks, links, emphasis. This directly degrades RAG retrieval quality and LLM comprehension.

**Solution:**

Add dependencies: `turndown`, `turndown-plugin-gfm`

Create `src/lib/toMarkdown.ts`:
- Initialize Turndown with GFM plugin (tables, strikethrough, task lists)
- Custom rules:
  - Preserve code blocks with language hints from `class="language-*"` / `class="hljs-*"`
  - Convert `<img>` to `![alt](src)` — preserves image references for future multimodal use
  - Strip empty headings and purely decorative elements

Update `extractMainContent.ts`:
- Readability returns both `textContent` (plain text) and `content` (cleaned HTML). Currently we only use `textContent`. Use `content` (the HTML) and pipe it through Turndown.
- Return both `markdown` (primary, for AI) and `text` (fallback, for search indexing).

Update `content.tsx` payload:
- Add `mainMarkdown` field alongside existing `mainText`.

**Why this matters:** The difference between "a wall of text" and "structured Markdown with headings and code blocks" is massive for RAG. This is arguably the highest-leverage change for AI quality.

---

### F3: Authentication Integration

**Problem:** `auth/auth-client.ts` creates a Better Auth client but it's never used. The popup sends `credentials: "include"` on fetch, which relies on having a valid session cookie for the API domain. If the user hasn't logged in via the web app recently, captures silently fail with 401.

**Solution:**

Update `popup.tsx`:
- On mount, call `authClient.getSession()`. If no active session, show a "Sign in to Deepen" state instead of the capture button. The sign-in button opens `PLASMO_PUBLIC_APP_URL/login`.
- After sign-in, the session cookie is set on the API domain. Subsequent `fetch` calls with `credentials: "include"` will be authenticated.
- Show the user's name/avatar when authenticated (from session data).

Create `src/background.ts` (service worker):
- Periodically check session validity (every 30 min).
- Store auth state in `chrome.storage.session` so the popup and content script can read it without re-checking.
- Set a badge icon (green dot / grey dot) to indicate auth status.

**Cross-origin consideration:** In production the extension origin and API origin differ. Session cookies work if the API sets `SameSite=None; Secure` on its cookies *and* the extension has the API domain in `host_permissions` (already configured in `package.json` manifest). Verify the server's cookie config supports this.

---

### F4: Selection Capture

**Problem:** Users often want to capture a specific paragraph, code snippet, or section — not the entire page. The code has a commented-out `window.getSelection()` line but no implementation.

**Solution:**

Create `src/lib/selectionCapture.ts`:
- `getSelectionAsMarkdown()`: Get the selected range via `window.getSelection()`, clone its contents (`range.cloneContents()`), convert the HTML fragment to Markdown via Turndown (reuse F2's converter).
- Include context metadata: page URL, page title, nearest parent heading (walk up from selection to find the closest `h1-h6`).

Update `content.tsx`:
- In the `extractPageData` handler, check `window.getSelection()` first. If there's a non-empty selection, return the selection as the primary content with `extractionMethod: "selection"`. Otherwise, fall back to full-page extraction.

Register keyboard shortcut:
- Add to `package.json` manifest: `"commands": { "capture": { "suggested_key": { "default": "Ctrl+Shift+S", "mac": "Command+Shift+S" }, "description": "Capture page or selection" } }`
- Handle in `background.ts`: on command, send `extractPageData` to the active tab's content script, then POST to API.

---

### F5: Shadow DOM & iframe Content Extraction

**Problem:** Web Components (shadow DOM) and iframes are invisible to Readability. Content inside them is silently skipped.

**Solution:**

Create `src/lib/domFlattener.ts`:
- `flattenShadowDOM(doc)`: Recursively walk the cloned DOM tree. For each element with a `shadowRoot`, clone the shadow tree's content and insert it as regular children (flattening the encapsulation boundary).
- `flattenSameOriginIframes(doc)`: For each `<iframe>` with an accessible `contentDocument`, extract its body and insert inline. Log cross-origin iframes as metadata.

Update `content.tsx`:
- Call `flattenShadowDOM()` and `flattenSameOriginIframes()` on the cloned document *before* passing it to `cleanDocument()` and `extractMainContent()`.

---

### F6: PDF Capture

**Problem:** PDF URLs are detected but `extractMainContent` returns `{ text: "", method: "pdf" }`. The content is lost.

**Solution — URL-forward approach (simplest, leverages existing server infrastructure):**

The server already has `trigger/pdfProcessing.ts` for extracting PDF text server-side. The extension should simply:

1. Detect PDF URL (already done).
2. Send `{ isPdf: true, url: "...", metadata: {...} }` to the save endpoint — just like today, but make it explicit that the server should fetch and process the PDF.
3. For `file://` or `blob:` PDFs (local files): read as ArrayBuffer, base64-encode, and include in the payload. Add a dedicated upload path on the server.

**Browser PDF viewer detection:**
- Chrome's built-in viewer: the URL *is* the PDF, so the URL-forward approach works directly.
- Embedded PDF.js viewers: attempt to extract rendered text from `.textLayer span` elements as a bonus.

---

### F7: Background Auto-Capture (Smart Capture)

**Problem:** Valuable concept — automatically save content the user spends time reading, without manual clicks.

**Solution:**

Create `src/background.ts` (extend from F3):
- Listen to `chrome.tabs.onActivated` and `chrome.tabs.onUpdated` (`status === 'complete'`).
- Start a dwell timer when a tab becomes active. Default threshold: 45 seconds (configurable).
- On threshold: send `extractPageData` to the content script, POST to API.
- **Deduplication:** Maintain a URL set in `chrome.storage.local` (LRU, max 1000 entries). Skip URLs captured in the last 24 hours.
- **Exclusion list:** Skip `chrome://`, `about:`, `chrome-extension://`, `chrome.google.com`, and user-configurable domains.
- **Feedback:** Set extension badge text ("Auto") briefly after auto-capture. No intrusive toast.

---

### F8: Offline Queue & Retry

**Problem:** If the backend is down or the user is offline, captures are silently lost. No retry.

**Solution:**

Create `src/lib/captureQueue.ts`:
- Queue captures in IndexedDB (using a simple wrapper or `idb` library).
- `enqueue(payload)`: Write to IndexedDB immediately.
- `flush()`: Process queue FIFO. On success, remove item. On network failure, retry with exponential backoff (5s → 10s → 30s → 60s, max 5 retries).
- Use Background Sync API (`registration.sync.register('flush-captures')`) in the service worker so retries happen automatically when connectivity is restored.

Update `popup.tsx`:
- Instead of sending directly to API, always enqueue then flush.
- Show pending queue count in popup footer if > 0 (e.g., "2 captures pending").

---

### F9: Settings & Configuration

**Problem:** No user-configurable settings. The UI shows a keyboard shortcut hint (`Cmd+S`) but it doesn't work.

**Solution:**

Create `src/options.tsx` (Plasmo options page):
- Auto-capture toggle + dwell threshold slider
- Domain exclusion list (for auto-capture)
- Capture format preference: Markdown / plain text / both
- View/clear offline queue

Create `src/lib/config.ts`:
- Central config module reading from `chrome.storage.sync` with sensible defaults.
- All other modules import config from here instead of using hardcoded values.

---

### F10: Site-Specific Content Handlers

**Problem:** Different content types have different optimal extraction strategies. A YouTube video, a tweet, and a GitHub repo page all need specialized handling.

**Solution:**

Create `src/lib/handlers/` directory with a handler registry:
- Each handler exports `{ matches(url: string): boolean, extract(doc: Document): CapturePayload }`.
- Check handlers in priority order. First match wins. Fall back to the generic Readability pipeline.

**Initial handlers:**
- `youtube.ts` — Video title, channel, description, transcript (from `ytInitialPlayerResponse` or captions track)
- `twitter.ts` — Tweet text, author, media URLs, thread context
- `github.ts` — README content, repo metadata, file content, or issue/PR depending on page type
- `arxiv.ts` — Paper title, abstract, authors, PDF link
- `stackoverflow.ts` — Question + accepted/top answers, separated clearly

---

## Implementation Phases

| Phase | Features | Outcome |
|-------|----------|---------|
| **Phase 1 — Core quality** | F1, F2, F3 | Captures are reliable on SPAs, structured as Markdown, and authenticated |
| **Phase 2 — User experience** | F4, F7, F8 | Selection capture, auto-capture, offline resilience |
| **Phase 3 — Coverage** | F5, F6, F10 | Shadow DOM, PDFs, YouTube/Twitter/GitHub handlers |
| **Phase 4 — Polish** | F9 | User settings, configurable behavior |

---

## Conventions

- All code lives in `extension/lnkd/src/`. New modules go in `src/lib/`.
- TypeScript everywhere. No `any` types in new code.
- Prefix console logs with `[Deepen]`.
- Keep the content script bundle lean — heavy libraries (Turndown) should be imported only when needed.
- Test extraction against: a static blog, a React SPA (Next.js docs), a tweet, a YouTube page, a GitHub repo, a PDF URL, and a paywalled article where the user is logged in.
