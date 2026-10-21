import { useState } from 'react'
import { Link } from 'react-router-dom'
import { tools, categories, getTool } from '../tools/registry'
import ToolCard from '../components/ToolCard'
import { useSeo } from '../useSeo'
export default function Home() {
  useSeo('ToolHub – Free Online Tools, No Sign-up', 'Free browser-based tools for text, calculators and more. Your input stays on your device.')
  const [q, setQ] = useState('')
  const term = q.trim().toLowerCase()
  const catName = (id: string) => categories.find(c => c.id === id)?.name ?? ''
  const results = term ? tools.filter(t => [t.name, t.description, catName(t.category)].join(' ').toLowerCase().includes(term)) : []
  let recent: string[] = []
  try { recent = JSON.parse(localStorage.getItem('recent') || '[]') } catch { /* ignore */ }
  const recentTools = recent.map(getTool).filter(Boolean)
  return (
    <div>
      <h1 className="mt-6 text-3xl font-bold">Free online tools that run in your browser</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">No sign-up. Text you type is processed on your device.</p>
      <label htmlFor="s" className="sr-only">Search tools</label>
      <input id="s" className="field mt-4 max-w-xl" type="search" placeholder="Search tools…" value={q} onChange={e => setQ(e.target.value)} />
      {term ? (
        <section className="mt-6" aria-live="polite">
          <h2 className="mb-3 text-xl font-semibold">{results.length} result(s)</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results.map(t => <ToolCard key={t.slug} t={t} />)}</div>
        </section>
      ) : (
        <>
          {recentTools.length > 0 && <section className="mt-8"><h2 className="mb-3 text-xl font-semibold">Recently used</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{recentTools.map(t => <ToolCard key={t!.slug} t={t!} />)}</div></section>}
          {categories.map(c => {
            const list = tools.filter(t => t.category === c.id)
            return (
              <section key={c.id} className="mt-8">
                <h2 className="mb-1 text-xl font-semibold"><Link to={`/category/${c.id}`} className="hover:text-brand">{c.name}</Link></h2>
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{c.blurb}</p>
                {list.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map(t => <ToolCard key={t.slug} t={t} />)}</div>
                  : <p className="text-sm italic text-slate-500">Not built yet (planned for a later milestone).</p>}
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}
