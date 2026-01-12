import type { PlasmoCSConfig } from "plasmo"
import { cleanDocument } from "./cleanDocument"
import { extractMainContent } from "./extractMainContent"
import { extractHeadings, extractImages, extractLinks, extractMetadata } from "./extractMetadata"
import { countWords, estimateReadingTime } from "./utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_end"
}

console.log("[Lnkd] Clean content script loaded");

export const MAX_TEXT_LENGTH = 100_000;
export const MIN_TEXT_LENGTH = 100;


chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "extractPageData") {
    (async () => {
      try {
        const start = performance.now()

        const isPdf = /\.pdf(\?.*)?$/i.test(window.location.href);

        const clonedDoc = document.cloneNode(true) as Document
        const cleanedDoc = cleanDocument(clonedDoc)
        const content = extractMainContent(cleanedDoc,isPdf)
        const metadata = extractMetadata()
        // const selectedText = window.getSelection()?.toString()?.trim() || ""

        const response = {
          success: true,
          url: window.location.href,
          title: metadata.title,
          description: metadata.description,
          siteName: metadata.siteName,
          author: metadata.author,
          keywords: metadata.keywords,
          favicon: metadata.favicon,
          publishedTime: metadata.publishedTime,
          language: document.documentElement.lang || "en",
          userAgent: navigator.userAgent,
          // selectedText: selectedText.slice(0, 2000),
          mainText: content.text,
          extractionMethod: content.method,
          // links: extractLinks(),
          // images: extractImages(),
          headings: extractHeadings(),
          timestamp: new Date().toISOString(),
          readingTime: estimateReadingTime(content.text),
          metrics: {
            wordCount: countWords(content.text),
            textLength: content.text.length,
            durationMs: performance.now() - start
          },
          isPdf: isPdf
        }
        sendResponse(response)
      } catch (e) {
        console.error("[Lnkd] Extraction error:", e)
        sendResponse({ success: false, error: (e as Error).message })
      }
    })()

    return true
  }
})
