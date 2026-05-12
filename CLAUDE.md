# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Deepen (codenamed LinkMeld) is an AI-powered knowledge management platform. This monorepo contains:

- **client/** — React 19 frontend (Vite + TailwindCSS 4 + TypeScript)
- **server/** — Express 5 backend (TypeScript + MongoDB + Qdrant)
- **extension/lnkd/** — Chrome extension for content capture (Plasmo + React 18)

## Development Commands

### Client (`client/`)
```bash
npm run dev        # Vite dev server on localhost:5173
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npm run preview    # Preview production build
```

### Server (`server/`)
```bash
npm run dev        # ts-node-dev with auto-restart on localhost:3000
npm run build      # TypeScript compile to dist/
npm start          # Run compiled JS (dist/api/server.js)
```

### Extension (`extension/lnkd/`)
```bash
pnpm dev           # Plasmo dev build with hot reload
pnpm build         # Production build
```

No test suite is configured. `npm test` exits with error in both client and server.

## Architecture

### Backend (`server/src/`)

Express 5 app entry point: `server/src/api/server.ts`

**Layered structure:**
- **api/routes/** — 8 route files mounted under `/api/v1/` (captures, folders, sources, user, ai, brain, feedback, waitlist)
- **api/controllers/** — Request handlers, one per route group
- **api/services/** — Business logic (pdfProcessor, user.service)
- **api/middleware/** — `authMiddleware.ts` (Better Auth session validation), `rateLimiter.ts` (standard: 100/15min, strict: 5/15min)
- **ai/services/** — aiService (OpenRouter summarization), brainChatService (RAG conversations), vectorStore (Qdrant indexing + search)
- **ai/clients/qdrant.ts** — Qdrant vector DB client, collection "documents", 768-dim cosine vectors
- **ai/prompts/** — LLM prompt templates
- **common/models/** — Mongoose models: Capture, Collection, User, UserProfile, BrainChat, Conversation, Feedback, Waitlist
- **common/security/crypto.ts** — AES-256-GCM encryption for stored API keys
- **trigger/** — Trigger.dev background jobs: aiProcessing, embeddingProcessing, pdfProcessing

**Auth:** Better Auth handles `/api/auth/*` directly (Google + GitHub OAuth, email/password). All other routes require the `authentication` middleware which injects `req.user`.

**RAG pipeline flow:**
1. Capture saved → Trigger.dev jobs fire for AI summarization + embedding
2. Text chunked (500 char max, sentence boundaries) → Gemini embeddings (768-dim) → stored in Qdrant
3. Brain Chat queries embed user message → cosine search Qdrant → context injected into OpenRouter LLM call → streamed response

### Frontend Client (`client/src/`)

**Routing:** TanStack Router with nested layouts defined in `client/src/routes.tsx`.
- Public routes: `/`, `/login`, `/register`, `/pricing`, `/faqs`, `/manifesto`, `/feedback`, `/privacy`, `/waitlist`
- Authenticated routes under `/in/`: captures, collections, sources, bookmarks, brain

**Layout hierarchy:** `MainShell` (auth guard + session) → `ContentLayout` (3-panel grid) → domain layouts (HomeLayout, FolderLayout, SourceLayout, BookmarkLayout)

**State management — three tiers:**
1. **Server state** — TanStack Query with Axios. Query key factory pattern in hooks (e.g., `captureQueryKeys.list(filter, id)`). Config: 5min stale time, 3 retries with exponential backoff.
2. **Client state** — Zustand stores per domain (`ui-store`, `app-store`, `capture-store`, `folder-store`, `source-store`, `brain-store`, `chat-store`, `settings-store`). Most persist to localStorage.
3. **Manager hooks** — `useCaptureManager`, `useChatManager`, `useFolderManager`, `useSourceManager` combine Zustand + TanStack Query into unified interfaces.

**API layer:** `client/src/api/index.ts` creates an Axios instance with 401 redirect interceptor. Domain-specific API modules in `client/src/api/*.api.ts`.

**Auth client:** Better Auth client in `client/src/lib/auth-client.ts`. Session checked in MainShell on mount.

**Styling:** TailwindCSS v4 via Vite plugin. Custom design tokens (stellar-purple, neon-blue, space-black) and fonts (Space Grotesk, Noto Serif) defined in `client/src/index.css`. Light/dark theme support.

**Key env vars:** `VITE_API_BASE_URL`, `VITE_AUTH_BASE_URL`, `VITE_API_TIMEOUT`

### Browser Extension (`extension/lnkd/`)

Plasmo framework (Chrome MV3). Captures webpage content and sends to backend API. Uses Turndown for HTML-to-Markdown conversion. Auth via better-auth matching the main app.

## Environment Variables (Server)

Required in `server/.env`:
- `MONGO_URI` — MongoDB connection string
- `REDIS_URL` — Redis (for Bull job queues)
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` — Auth config
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth
- `OPENROUTER_API_KEY` — LLM access via OpenRouter
- `GEMINI_API_KEY` — Embedding generation
- `QDRANT_CLOUD_URL`, `QDRANT_API_KEY` — Vector database
- `ENCRYPTION_KEY` — AES-256 key (64-char hex) for encrypting stored user API keys
- `CF_R2_ACCESS_KEY_ID`, `CF_R2_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_PUBLIC_DOMAIN` — Cloudflare R2 file storage
- `TRIGGER_SECRET_KEY` — Trigger.dev background jobs

## Key Patterns

- **No shared dependencies** between client and server — install packages in the correct subdirectory.
- Server uses CommonJS (`module: "commonjs"` in tsconfig), client uses ESM (`"type": "module"`).
- CORS whitelist is hardcoded in `server/src/api/server.ts` — update when adding new frontend origins.
- Capture model has extensive pre-save hooks (slug generation, URL normalization, content hashing, word count) — be aware when modifying Capture schema.
- Brain Chat streaming uses OpenRouter SDK's streaming API with abort controller support on the client side.
