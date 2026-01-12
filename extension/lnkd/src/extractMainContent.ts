import { MIN_TEXT_LENGTH } from "./content"
import { cleanText } from "./utils"


export function extractMainContent(doc: Document, isPdf: boolean) {
    if (isPdf) {
      return { text: "", method: "pdf" }
    }
  
    try {
      const reader = new (window as any).Readability(doc).parse()
      if (reader?.textContent && reader.textContent.length > MIN_TEXT_LENGTH) {
        return { text: cleanText(reader.textContent), method: "readability" }
      }
    } catch {
      console.warn("[Lnkd] Readability failed")
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
  