/**
 * toMarkdown.ts
 *
 * Converts cleaned HTML (from Readability) to Markdown.
 *
 * Why Markdown over plain text for AI ingestion:
 * - Headings tell the LLM about document structure and topic boundaries
 * - Code blocks are preserved with language hints (critical for technical content)
 * - Tables remain parseable instead of becoming jumbled text
 * - Links are preserved as [text](url) — useful for citation and reference
 * - Lists retain their hierarchy
 */

import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"

let instance: TurndownService | null = null

function createConverter(): TurndownService {
  const turndown = new TurndownService({
    headingStyle: "atx",            // # Heading style (not underline)
    codeBlockStyle: "fenced",       // ```code``` style (not indented)
    bulletListMarker: "-",
    emDelimiter: "*",
  })

  // GFM support: tables, strikethrough, task lists
  turndown.use(gfm)

  // Preserve language hints on code blocks
  // Readability keeps <pre><code class="language-python"> or <pre><code class="hljs-python">
  turndown.addRule("fencedCodeWithLang", {
    filter(node) {
      return (
        node.nodeName === "PRE" &&
        node.firstChild?.nodeName === "CODE"
      )
    },
    replacement(_content, node) {
      const codeEl = node.firstChild as HTMLElement
      const classNames = codeEl.className || ""

      // Extract language from class="language-python" or class="hljs language-python"
      const langMatch = classNames.match(/(?:language-|hljs-)(\w+)/)
      const lang = langMatch?.[1] || ""

      // Use textContent to avoid nested HTML inside code blocks
      const code = codeEl.textContent || ""

      return `\n\n\`\`\`${lang}\n${code.replace(/\n$/, "")}\n\`\`\`\n\n`
    },
  })

  // Strip empty headings (some sites have <h2></h2> or <h2> </h2> as spacers)
  turndown.addRule("removeEmptyHeadings", {
    filter(node) {
      return (
        /^H[1-6]$/.test(node.nodeName) &&
        (node.textContent?.trim().length || 0) === 0
      )
    },
    replacement() {
      return ""
    },
  })

  // Convert images to markdown — preserves references for future multimodal use
  // but skip tiny tracking pixels / decorative icons
  turndown.addRule("meaningfulImages", {
    filter(node) {
      if (node.nodeName !== "IMG") return false
      const img = node as HTMLImageElement
      // Skip base64 data URIs (tracking pixels, inline icons)
      if (img.src?.startsWith("data:")) return false
      // Skip tiny images (likely icons/avatars, not content)
      if (img.width > 0 && img.width < 50) return false
      return true
    },
    replacement(_content, node) {
      const img = node as HTMLImageElement
      const alt = img.alt || img.title || ""
      const src = img.src || ""
      if (!src) return ""
      return `![${alt}](${src})`
    },
  })

  return turndown
}

/**
 * Convert an HTML string to Markdown.
 * Reuses a single TurndownService instance for performance.
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return ""

  if (!instance) {
    instance = createConverter()
  }

  const markdown = instance.turndown(html)

  // Clean up excessive blank lines (3+ consecutive newlines → 2)
  return markdown.replace(/\n{3,}/g, "\n\n").trim()
}
