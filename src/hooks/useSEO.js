import { useEffect } from 'react'

const BASE_TITLE = 'GamingStore | Premium PC Hardware'
const BASE_DESC  = 'Premium custom PC builds, cutting-edge components, and ergonomic furniture — configured, tested, and delivered ready to perform.'
const BASE_IMAGE = 'https://images.unsplash.com/photo-1759836096334-e65e1706bb59?auto=format&fit=crop&w=1200&q=80'

function setMeta(key, value, attr = 'property') {
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function useSEO({ title, description, image } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — GamingStore` : BASE_TITLE
    const desc  = description || BASE_DESC
    const img   = image || BASE_IMAGE

    document.title = fullTitle
    setMeta('og:title',            fullTitle)
    setMeta('og:description',      desc)
    setMeta('og:image',            img)
    setMeta('twitter:title',       fullTitle, 'name')
    setMeta('twitter:description', desc,      'name')
    setMeta('twitter:image',       img,       'name')
    setMeta('description',         desc,      'name')

    return () => {
      document.title = BASE_TITLE
      setMeta('og:title',            BASE_TITLE)
      setMeta('og:description',      BASE_DESC)
      setMeta('og:image',            BASE_IMAGE)
      setMeta('twitter:title',       BASE_TITLE, 'name')
      setMeta('twitter:description', BASE_DESC,  'name')
      setMeta('twitter:image',       BASE_IMAGE, 'name')
      setMeta('description',         BASE_DESC,  'name')
    }
  }, [title, description, image])
}
