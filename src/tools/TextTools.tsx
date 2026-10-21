import { useState, type ReactNode } from 'react'
const Box = ({ v, set, label }: { v: string; set?: (s: string) => void; label: string }) => (
  <div><label className="mb-1 block text-sm font-medium">{label}
    <textarea className="field mt-1 h-48" value={v} readOnly={!set} onChange={e => set?.(e.target.value)} /></label></div>)
const Out = ({ v }: { v: string }) => {
  const dl = () => { const u = URL.createObjectURL(new Blob([v], { type: 'text/plain' })); const a = document.createElement('a'); a.href = u; a.download = 'result.txt'; a.click(); URL.revokeObjectURL(u) }
  return <div><Box v={v} label="Result" />
    <div className="mt-2 flex gap-2"><button className="btn" onClick={() => navigator.clipboard.writeText(v)}>Copy</button><button className="btn-2" onClick={dl}>Download .txt</button></div></div>
}
type O = Record<string, any>
function Transform({ fn, opts }: { fn: (s: string, o: O) => string; opts?: (o: O, s: (k: string, v: any) => void) => ReactNode }) {
  const [t, setT] = useState(''); const [o, setO] = useState<O>({})
  let out = '', err = ''
  try { out = fn(t, o) } catch (e) { err = (e as Error).message }
  return <div className="space-y-3"><Box v={t} set={setT} label="Your text" />
    {opts?.(o, (k, v) => setO({ ...o, [k]: v }))}
    <button className="btn-2" onClick={() => { setT(''); setO({}) }}>Reset</button>
    {err ? <p role="alert" className="text-red-600">{err}</p> : <Out v={out} />}</div>
}
const Stat = ({ k, v }: { k: string; v: number | string }) => <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"><div className="text-2xl font-bold">{v}</div><div className="text-sm text-slate-600 dark:text-slate-400">{k}</div></div>
function Counter({ chars }: { chars?: boolean }) {
  const [t, setT] = useState('')
  const words = t.trim() ? t.trim().split(/\s+/).length : 0
  const sentences = (t.match(/[^.!?]+[.!?]+/g) || []).length
  return <div className="space-y-3"><Box v={t} set={setT} label="Type or paste text" />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-live="polite">
      {!chars && <Stat k="Words" v={words} />}<Stat k="Characters" v={[...t].length} />
      <Stat k="Characters (no spaces)" v={[...t.replace(/\s/g, '')].length} />
      {!chars && <><Stat k="Sentences" v={sentences} /><Stat k="Lines" v={t ? t.split('\n').length : 0} /><Stat k="Reading time (min)" v={Math.max(words ? 1 : 0, Math.ceil(words / 200))} /></>}</div>
    <button className="btn-2" onClick={() => setT('')}>Reset</button></div>
}
export const WordCounter = () => <Counter />
export const CharacterCounter = () => <Counter chars />
export const CaseConverter = () => <Transform fn={(s, o) => {
  switch (o.m) {
    case 'lower': return s.toLowerCase()
    case 'title': return s.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase())
    case 'sentence': return s.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, a, b) => a + b.toUpperCase())
    default: return s.toUpperCase()
  }
}} opts={(o, set) => <select aria-label="Case" className="field max-w-xs" value={o.m || 'upper'} onChange={e => set('m', e.target.value)}>
  <option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="title">Title Case</option><option value="sentence">Sentence case</option></select>} />
export const RemoveSpaces = () => <Transform fn={(s, o) => {
  const r = s.split('\n').map(l => l.replace(/[ \t]+/g, ' ').trim()).join('\n')
  return o.blank ? r.split('\n').filter(Boolean).join('\n') : r
}} opts={(o, set) => <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!o.blank} onChange={e => set('blank', e.target.checked)} />Also remove blank lines</label>} />
export const TextReverser = () => <Transform fn={(s, o) => {
  if (o.m === 'words') return s.split(/(\s+)/).map(w => [...w].reverse().join('')).join('')
  if (o.m === 'lines') return s.split('\n').reverse().join('\n')
  return [...s].reverse().join('')
}} opts={(o, set) => <select aria-label="Mode" className="field max-w-xs" value={o.m || 'all'} onChange={e => set('m', e.target.value)}>
  <option value="all">Reverse whole text</option><option value="words">Reverse each word</option><option value="lines">Reverse line order</option></select>} />
export const DedupeLines = () => <Transform fn={(s, o) => {
  const seen = new Set<string>()
  return s.split('\n').filter(l => { const k = o.ci ? l.toLowerCase() : l; if (seen.has(k)) return false; seen.add(k); return true }).join('\n')
}} opts={(o, set) => <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!o.ci} onChange={e => set('ci', e.target.checked)} />Ignore case</label>} />
export const FindReplace = () => <Transform fn={(s, o) => {
  const f = o.f || ''; if (!f) return s
  const re = o.rx ? new RegExp(f, 'g') : new RegExp(f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
  return s.replace(re, o.r || '')
}} opts={(o, set) => <div className="space-y-2">
  <input aria-label="Find" className="field" placeholder="Find" value={o.f || ''} onChange={e => set('f', e.target.value)} />
  <input aria-label="Replace with" className="field" placeholder="Replace with" value={o.r || ''} onChange={e => set('r', e.target.value)} />
  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!o.rx} onChange={e => set('rx', e.target.checked)} />Use regular expression</label></div>} />
