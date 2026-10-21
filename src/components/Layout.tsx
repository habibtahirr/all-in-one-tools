import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { categories } from '../tools/registry'
export default function Layout() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 dark:border-slate-700">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 p-4" aria-label="Main">
          <Link to="/" className="text-xl font-bold text-brand">ToolHub</Link>
          <div className="flex flex-1 flex-wrap gap-3 text-sm">
            {categories.map(c => <Link key={c.id} to={`/category/${c.id}`} className="hover:text-brand">{c.name}</Link>)}
          </div>
          <button className="btn-2" onClick={() => setDark(!dark)} aria-pressed={dark}>{dark ? 'Light' : 'Dark'} mode</button>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 p-4"><Outlet /></main>
      <footer className="border-t border-slate-200 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
        © {new Date().getFullYear()} ToolHub. Tools run in your browser; text you enter is not uploaded.
      </footer>
    </div>
  )
}
