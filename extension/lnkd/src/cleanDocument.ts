export function cleanDocument(doc: Document): Document {
    const selectors = [
      "header", "footer", "nav", "aside", "form", "noscript", "script", "style",
      ".ad", ".ads", ".promo", ".social", ".popup", ".cookie", ".newsletter",
      ".breadcrumb", ".related", ".share", ".subscribe", ".login", ".signup"
    ]
  
    selectors.forEach(sel => {
      doc.querySelectorAll(sel).forEach(node => node.remove())
    })
  
    return doc
  }
  

  export function getCleanMainContentRoot(): HTMLElement | null {
    const clonedDoc = document.cloneNode(true) as Document
    const selectorsToRemove = [
      "header", "footer", "nav", "aside", "form", "noscript", "script", "style",
      ".ad", ".ads", ".promo", ".social", ".popup", ".cookie", ".newsletter",
      ".breadcrumb", ".related", ".share", ".subscribe", ".login", ".signup",
      ".comments", ".recommended", ".sidebar", ".footer"
    ]
  
    for (const sel of selectorsToRemove) {
      clonedDoc.querySelectorAll(sel).forEach(el => el.remove())
    }
  
    const root =
      clonedDoc.querySelector("main") ||
      clonedDoc.querySelector("article") ||
      clonedDoc.querySelector("[role='main']") ||
      clonedDoc.body
  
    return root as HTMLElement
  }
  