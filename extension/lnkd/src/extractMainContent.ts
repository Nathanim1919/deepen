import { Readability } from "@mozilla/readability"

import { MIN_TEXT_LENGTH } from "./constants"
import { htmlToMarkdown } from "./lib/toMarkdown"
import { cleanText } from "./utils"

export interface ExtractionResult {
  text: string
  markdown: string
  method: string
}

export function extractMainContent(
  doc: Document,
  isPdf: boolean
): ExtractionResult {
  if (isPdf) {
    return { text: "", markdown: "", method: "pdf" }
  }

  // Primary: Readability — returns both cleaned HTML and plain text
  try {
    const parsed = new Readability(doc).parse()
    if (parsed?.textContent && parsed.textContent.length > MIN_TEXT_LENGTH) {
      return {
        text: cleanText(parsed.textContent),
        // parsed.content is the cleaned HTML — convert to Markdown
        markdown: parsed.content ? htmlToMarkdown(parsed.content) : "",
        method: "readability",
      }
    }
  } catch {
    console.warn("[Deepen] Readability failed, using fallbacks")
  }

  // Fallback: try semantic selectors
  const fallbackSelectors = ["main", "article", "[role='main']", "#content"]
  for (const sel of fallbackSelectors) {
    const el = doc.querySelector(sel)
    if (!el) continue
    const text = cleanText(el.textContent || "")
    if (text.length > MIN_TEXT_LENGTH) {
      return {
        text,
        markdown: htmlToMarkdown(el.innerHTML),
        method: `fallback:${sel}`,
      }
    }
  }

  // Last resort: entire body
  const fallbackText = cleanText(doc.body.textContent || "")
  return {
    text: fallbackText,
    markdown: htmlToMarkdown(doc.body.innerHTML),
    method: "fallback:body",
  }
}
