/**
 * capturePageData.ts
 *
 * Captures page content using chrome.scripting.executeScript (activeTab + scripting).
 *
 * Flow:
 * 1. Inject a self-contained function into the active tab — it waits for DOM
 *    settlement (SPA support), then returns raw HTML + metadata.
 * 2. Parse the HTML locally in the popup via DOMParser.
 * 3. Run the same pipeline as before: cleanDocument → Readability → Turndown.
 */

import { cleanDocument } from "../cleanDocument"
import { extractMainContent } from "../extractMainContent"
import { extractHeadings, extractLinks } from "../extractMetadata"
import { countWords, estimateReadingTime } from "../utils"

/**
 * Injected into the page via chrome.scripting.executeScript.
 * MUST be entirely self-contained — no imports, no closures, no external references.
 */
async function injectedExtractor() {
  // ── Wait for DOM to settle (handles SPAs that load content async) ──
  await new Promise<void>((resolve) => {
    let quietTimer: ReturnType<typeof setTimeout>
    let observer: MutationObserver

    const hardTimeout = setTimeout(() => {
      clearTimeout(quietTimer)
      observer?.disconnect()
      resolve()
    }, 8000)

    function resetQuietTimer() {
      clearTimeout(quietTimer)
      quietTimer = setTimeout(() => {
        clearTimeout(hardTimeout)
        observer?.disconnect()
        resolve()
      }, 800)
    }

    observer = new MutationObserver((mutations) => {
      const hasMeaningful = mutations.some(
        (m) =>
          m.type === "childList" &&
          (m.addedNodes.length > 0 || m.removedNodes.length > 0)
      )
      if (hasMeaningful) resetQuietTimer()
    })

    observer.observe(document.body, { childList: true, subtree: true })
    resetQuietTimer()
  })

  // ── Extract metadata from the live DOM ──
  const getMeta = (name: string): string =>
    (
      document.querySelector(
        `meta[name='${name}'], meta[property='${name}']`
      ) as HTMLMetaElement
    )?.content || ""

  return {
    html: document.documentElement.outerHTML,
    url: window.location.href,
    title: document.title || "Untitled",
    description: getMeta("description") || getMeta("og:description"),
    favicon:
      (document.querySelector("link[rel~='icon']") as HTMLLinkElement)?.href ||
      "",
    siteName: getMeta("og:site_name"),
    author: getMeta("author"),
    keywords: getMeta("keywords"),
    publishedTime: getMeta("article:published_time"),
    language: document.documentElement.lang || "en",
    isPdf: /\.pdf(\?.*)?$/i.test(window.location.href)
  }
}

/**
 * Capture the active tab's page content.
 *
 * Uses chrome.scripting.executeScript (requires "activeTab" + "scripting" permissions)
 * to inject a lightweight extractor, then processes the returned HTML locally.
 */
export async function capturePageData(tabId: number) {
  const start = performance.now()

  // 1. Inject extractor into the page and get raw HTML + metadata
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: injectedExtractor
  })

  const rawData = results[0]?.result as ReturnType<
    typeof injectedExtractor
  > extends Promise<infer T>
    ? T
    : never | undefined

  if (!rawData) {
    throw new Error("Failed to extract page data")
  }

  // 2. Parse the raw HTML locally
  const parser = new DOMParser()
  const doc = parser.parseFromString(rawData.html, "text/html")

  // Set base URL so relative links/images resolve correctly.
  // Only add if the page doesn't already have a <base> tag.
  if (!doc.querySelector("base")) {
    const base = doc.createElement("base")
    base.href = rawData.url
    doc.head.prepend(base)
  }

  // 3. Clean document (strip nav, ads, scripts, etc.)
  cleanDocument(doc)

  // Clone before Readability modifies the document
  const docClone = doc.cloneNode(true) as Document

  // 4. Extract main content (Readability → Markdown)
  const content = extractMainContent(doc, rawData.isPdf)

  // 5. Extract structural metadata from the unmodified clone
  const headings = extractHeadings(docClone)
  const links = extractLinks(docClone)

  return {
    success: true as const,
    url: rawData.url,
    title: rawData.title,
    description: rawData.description,
    siteName: rawData.siteName,
    author: rawData.author,
    keywords: rawData.keywords,
    favicon: rawData.favicon,
    publishedTime: rawData.publishedTime,
    language: rawData.language,
    mainText: content.text,
    mainMarkdown: content.markdown,
    extractionMethod: content.method,
    links,
    headings,
    timestamp: new Date().toISOString(),
    readingTime: estimateReadingTime(content.text),
    metrics: {
      wordCount: countWords(content.text),
      textLength: content.text.length,
      durationMs: performance.now() - start
    },
    isPdf: rawData.isPdf
  }
}
