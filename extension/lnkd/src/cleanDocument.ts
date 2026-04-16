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

