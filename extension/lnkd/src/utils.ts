import { MAX_TEXT_LENGTH } from "./content"

export function cleanText(raw: string): string {
    return raw.replace(/\s+/g, " ").trim().slice(0, MAX_TEXT_LENGTH)
  }
  
  export function countWords(text: string): number {
    return text.split(/\s+/).filter(Boolean).length
  }
  
  export function estimateReadingTime(text: string, wpm = 200): number {
    return Math.ceil(countWords(text) / wpm)
  }
  