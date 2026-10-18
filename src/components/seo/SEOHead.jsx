import { useEffect } from 'react'

/**
 * Robust SEO, OpenGraph, Twitter Card, and JSON-LD Structured Data Injector
 * Dynamically modifies document head tags and schema scripts.
 */
const SEOHead = ({
  title,
  description,
  canonicalUrl,
  image,
  keywords,
  productJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
}) => {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title
    }

    // Helper for meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrValue)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description)
    if (keywords) {
      setMetaTag('name', 'keywords', keywords)
    }
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

    // 3. OpenGraph Tags
    setMetaTag('property', 'og:title', title)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:type', 'product')
    setMetaTag('property', 'og:site_name', 'TFiPro Pakistan')
    if (canonicalUrl) {
      setMetaTag('property', 'og:url', canonicalUrl)
    }
    if (image) {
      setMetaTag('property', 'og:image', image)
    }

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', title)
    setMetaTag('name', 'twitter:description', description)
    if (image) {
      setMetaTag('name', 'twitter:image', image)
    }

    // 5. Canonical Link
    if (canonicalUrl) {
      let linkEl = document.querySelector('link[rel="canonical"]')
      if (!linkEl) {
        linkEl = document.createElement('link')
        linkEl.setAttribute('rel', 'canonical')
        document.head.appendChild(linkEl)
      }
      linkEl.setAttribute('href', canonicalUrl)
    }

    // 6. JSON-LD Structured Data Scripts
    const setJsonLdScript = (id, data) => {
      let script = document.getElementById(id)
      if (!data) {
        if (script) script.remove()
        return
      }
      if (!script) {
        script = document.createElement('script')
        script.id = id
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.text = JSON.stringify(data)
    }

    if (productJsonLd) setJsonLdScript('tfipro-product-jsonld', productJsonLd)
    if (faqJsonLd) setJsonLdScript('tfipro-faq-jsonld', faqJsonLd)
    if (breadcrumbJsonLd) setJsonLdScript('tfipro-breadcrumb-jsonld', breadcrumbJsonLd)

    return () => {
      // Optional cleanup on unmount
    }
  }, [title, description, canonicalUrl, image, keywords, productJsonLd, faqJsonLd, breadcrumbJsonLd])

  return null
}

export default SEOHead
