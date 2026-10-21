import { Suspense, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTool, categories } from '../tools/registry'
import ToolCard from '../components/ToolCard'
import AdSlot from '../components/AdSlot'
import NotFound from './NotFound'
import { useSeo } from '../useSeo'
export default function ToolPage() {
  const { slug = '' } = useParams()
  const t = getTool(slug)
  useSeo(t ? `${t.name} – Free Online Tool | ToolHub` : 'Not found', t?.description ?? '')
  useEffect(() => {
    if (!t) return
    try {
      const r: string[] = JSON.parse(localStorage.getItem('recent') || '[]')
      localStorage.setItem('recent', JSON.stringify([t.slug, ...r.filter(s => s !== t.slug)].slice(0, 6)))
    } catch { /* ignore */ }
  }, [t])
  if (!t) return <NotFound />
  const cat = categories.find(c => c.id === t.category)!
  const related = t.related.map(getTool).filter(Boolean)
  const Tool = t.Component
  return (
    <article>
      <nav aria-label="Breadcrumb" className="text-sm"><Link to="/" className="text-brand">Home</Link> / <Link to={`/category/${cat.id}`} className="text-brand">{cat.name}</Link> / {t.name}</nav>
      <h1 className="mt-3 text-3xl font-bold">{t.name}</h1>
      <p className="mb-6 mt-1 text-slate-600 dark:text-slate-400">{t.description}</p>
      <Suspense fallback={<p role="status">Loading tool…</p>}><Tool /></Suspense>
      <AdSlot />
      <section className="mt-8"><h2 className="text-xl font-semibold">About this tool</h2><p className="mt-2">{t.about}</p></section>
      <section className="mt-8"><h2 className="text-xl font-semibold">FAQ</h2>
        {t.faqs.map(([q, a]) => <div key={q} className="mt-3"><h3 className="font-medium">{q}</h3><p className="text-slate-600 dark:text-slate-400">{a}</p></div>)}</section>
      {related.length > 0 && <section className="mt-8"><h2 className="mb-3 text-xl font-semibold">Related tools</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{related.map(r => <ToolCard key={r!.slug} t={r!} />)}</div></section>}
    </article>
  )
}
