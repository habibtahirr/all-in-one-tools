import { Link, useParams } from 'react-router-dom'
import { tools, categories } from '../tools/registry'
import ToolCard from '../components/ToolCard'
import NotFound from './NotFound'
import { useSeo } from '../useSeo'
export default function CategoryPage() {
  const { id } = useParams()
  const c = categories.find(x => x.id === id)
  useSeo(c ? `${c.name} – Free Online Tools | ToolHub` : 'Not found', c?.blurb ?? '')
  if (!c) return <NotFound />
  const list = tools.filter(t => t.category === c.id)
  return (
    <div>
      <nav aria-label="Breadcrumb" className="text-sm"><Link to="/" className="text-brand">Home</Link> / {c.name}</nav>
      <h1 className="mt-3 text-3xl font-bold">{c.name}</h1>
      <p className="mb-4 mt-1 text-slate-600 dark:text-slate-400">{c.blurb}</p>
      {list.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map(t => <ToolCard key={t.slug} t={t} />)}</div>
        : <p className="italic text-slate-500">No tools in this category yet.</p>}
    </div>
  )
}
