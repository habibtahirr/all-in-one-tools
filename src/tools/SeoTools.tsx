import { useState } from 'react'
const L = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block text-sm font-medium">{label}<div className="mt-1">{children}</div></label>
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
function Out({ v, name, type = 'text/plain' }: { v: string; name: string; type?: string }) {
  const dl = () => { const u = URL.createObjectURL(new Blob([v], { type })); const a = document.createElement('a'); a.href = u; a.download = name; a.click(); URL.revokeObjectURL(u) }
  return <div className="mt-3"><textarea aria-label="Result" readOnly className="field h-48 font-mono" value={v} />
    <div className="mt-2 flex gap-2"><button className="btn" onClick={() => navigator.clipboard.writeText(v)}>Copy</button><button className="btn-2" onClick={dl}>Download {name}</button></div></div>
}
export function SlugGenerator() {
  const [t, setT] = useState('')
  const slug = t.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return <div className="space-y-3"><L label="Title or phrase"><input className="field" value={t} onChange={e => setT(e.target.value)} /></L>
    <p className="text-sm text-slate-600 dark:text-slate-400">Letters outside a–z (for example Urdu or Hindi script) are removed, so use an English title.</p>
    <Out v={slug} name="slug.txt" /></div>
}
export function MetaGenerator() {
  const [v, set] = useState({ title: '', desc: '', url: '', img: '' })
  const p = (k: keyof typeof v) => ({ className: 'field', value: v[k], onChange: (e: any) => set({ ...v, [k]: e.target.value }) })
  const out = [`<title>${esc(v.title)}</title>`, `<meta name="description" content="${esc(v.desc)}" />`, v.url && `<link rel="canonical" href="${esc(v.url)}" />`,
    `<meta property="og:title" content="${esc(v.title)}" />`, `<meta property="og:description" content="${esc(v.desc)}" />`, v.url && `<meta property="og:url" content="${esc(v.url)}" />`,
    v.img && `<meta property="og:image" content="${esc(v.img)}" />`, '<meta property="og:type" content="website" />'].filter(Boolean).join('\n')
  return <div className="space-y-3"><L label="Page title"><input {...p('title')} /></L><L label="Meta description"><textarea {...p('desc')} /></L>
    <L label="Page URL (optional)"><input {...p('url')} placeholder="https://example.com/page" /></L><L label="Image URL (optional)"><input {...p('img')} /></L>
    <Out v={v.title || v.desc ? out : ''} name="meta-tags.html" /></div>
}
export function RobotsGenerator() {
  const [dis, setDis] = useState(''); const [sm, setSm] = useState('')
  const lines = ['User-agent: *', ...dis.split('\n').map(s => s.trim()).filter(Boolean).map(s => `Disallow: ${s}`)]
  if (!dis.trim()) lines.push('Allow: /')
  if (sm.trim()) lines.push('', `Sitemap: ${sm.trim()}`)
  return <div className="space-y-3"><L label="Paths to block (one per line, e.g. /admin/)"><textarea className="field h-28" value={dis} onChange={e => setDis(e.target.value)} /></L>
    <L label="Sitemap URL (optional)"><input className="field" value={sm} onChange={e => setSm(e.target.value)} placeholder="https://example.com/sitemap.xml" /></L>
    <p className="text-sm text-slate-600 dark:text-slate-400">robots.txt asks crawlers to skip paths; it does not hide pages or protect private data.</p><Out v={lines.join('\n')} name="robots.txt" /></div>
}
export function SitemapGenerator() {
  const [t, setT] = useState('')
  const urls = t.split('\n').map(s => s.trim()).filter(Boolean)
  const bad = urls.filter(u => { try { const x = new URL(u); return !/^https?:$/.test(x.protocol) } catch { return true } })
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u.replace(/&/g, '&amp;')}</loc></url>`).join('\n')}\n</urlset>`
  return <div className="space-y-3"><L label="Full URLs, one per line"><textarea className="field h-40" value={t} onChange={e => setT(e.target.value)} placeholder="https://example.com/" /></L>
    {bad.length > 0 && <p role="alert" className="text-red-600">Invalid URL(s): {bad.slice(0, 3).join(', ')}{bad.length > 3 ? '…' : ''}</p>}
    {urls.length > 0 && bad.length === 0 && <Out v={xml} name="sitemap.xml" type="application/xml" />}</div>
}
export function SerpPreview() {
  const [v, set] = useState({ title: '', desc: '', url: 'https://example.com/page' })
  const cut = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s)
  return <div className="space-y-3"><L label="Title"><input className="field" value={v.title} onChange={e => set({ ...v, title: e.target.value })} /></L>
    <L label="Description"><textarea className="field" value={v.desc} onChange={e => set({ ...v, desc: e.target.value })} /></L>
    <L label="URL"><input className="field" value={v.url} onChange={e => set({ ...v, url: e.target.value })} /></L>
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><div className="text-xs text-slate-600 dark:text-slate-400">{v.url}</div>
      <div className="text-xl text-blue-700 dark:text-blue-400">{cut(v.title, 60) || 'Your page title'}</div>
      <div className="text-sm text-slate-700 dark:text-slate-300">{cut(v.desc, 160) || 'Your meta description appears here.'}</div></div>
    <p className="text-sm text-slate-600 dark:text-slate-400">Title {v.title.length} chars · description {v.desc.length} chars. Google truncates by pixel width, so the 60/160 limits are rough guides and this is an approximation, not Google's real output.</p></div>
}
