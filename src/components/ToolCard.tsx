import { Link } from 'react-router-dom'
import type { Tool } from '../tools/registry'
export default function ToolCard({ t }: { t: Tool }) {
  return (
    <Link to={`/tools/${t.slug}`} className="block rounded-xl border border-slate-200 p-4 transition hover:border-brand hover:shadow-sm dark:border-slate-700">
      <h3 className="font-semibold">{t.name}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t.description}</p>
    </Link>
  )
}
