import { useEffect } from 'react'
export function useSeo(title: string, description: string) {
  useEffect(() => {
    document.title = title
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m) }
    m.setAttribute('content', description)
    let c = document.querySelector('link[rel="canonical"]')
    if (!c) { c = document.createElement('link'); c.setAttribute('rel', 'canonical'); document.head.appendChild(c) }
    c.setAttribute('href', window.location.origin + window.location.pathname)
  }, [title, description])
}
