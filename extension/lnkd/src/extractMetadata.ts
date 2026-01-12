import { getCleanMainContentRoot } from "./cleanDocument"
import { cleanText } from "./utils"

export function extractMetadata() {
    const meta = (name: string) =>
      (document.querySelector(`meta[name='${name}'], meta[property='${name}']`) as HTMLMetaElement)?.content || ""
  
    return {
      title: document.title || "Untitled",
      description: meta("description") || meta("og:description") || "",
      favicon: (document.querySelector("link[rel~='icon']") as HTMLLinkElement)?.href || "",
      siteName: meta("og:site_name"),
      author: meta("author"),
      keywords: meta("keywords"),
      publishedTime: meta("article:published_time"),
    }
  }
  

  export function extractLinks() {
    return Array.from(document.querySelectorAll("a[href]"))
      .filter(link => link.textContent?.trim())
      .map(link => ({
        href: (link as HTMLAnchorElement).href,
        text: cleanText(link.textContent || ""),
        title: link.getAttribute("title") || link.getAttribute("aria-label") || ""
      }))
  }
  
  export function extractImages() {
    return Array.from(document.querySelectorAll("img[src]") as NodeListOf<HTMLImageElement>)
      .filter(img => img.src && !img.src.startsWith("data:"))
      .map(img => ({
        src: img.src,
        alt: img.alt || "",
        title: img.title || "",
        width: img.width || 0,
        height: img.height || 0
      }))
  }
  
  export function extractHeadings(): { level: number; text: string }[] {
    const cleanRoot = getCleanMainContentRoot()
    if (!cleanRoot) return []
  
    return Array.from(cleanRoot.querySelectorAll("h1,h2,h3,h4,h5,h6"))
      .map(h => ({
        level: Math.min(Math.max(Number(h.tagName[1]), 1), 6),
        text: cleanText(h.textContent || "")
      }))
      .filter(h =>
        h.text.length > 10 &&
        !/^(must read|recommended|share this|like this|more articles|about us|popular category|editor picks)$/i.test(h.text.trim()) &&
        !h.text.toLowerCase().includes("advert") &&
        !h.text.toLowerCase().includes("related")
      )
  }
  