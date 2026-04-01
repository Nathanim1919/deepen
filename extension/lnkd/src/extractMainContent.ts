import { Readability } from "@mozilla/readability"

import { MIN_TEXT_LENGTH } from "./constants"
import { cleanText } from "./utils"

export function extractMainContent(doc: Document, isPdf: boolean) {
  if (isPdf) {
    return { text: "", method: "pdf" }
  }

  try {
    const parsed = new Readability(doc).parse()
    if (parsed?.textContent && parsed.textContent.length > MIN_TEXT_LENGTH) {
      return { text: cleanText(parsed.textContent), method: "readability" }
    }
  } catch {
    console.warn("[Lnkd] Readability failed, using fallbacks")
  }

  const fallbackSelectors = ["main", "article", "[role='main']", "#content"]
  for (const sel of fallbackSelectors) {
    const el = doc.querySelector(sel)
    const text = cleanText(el?.textContent || "")
    if (text.length > MIN_TEXT_LENGTH) {
      return { text, method: `fallback:${sel}` }
    }
  }

  const fallbackText = cleanText(doc.body.textContent || "")
  return { text: fallbackText, method: "fallback:body" }
}
  