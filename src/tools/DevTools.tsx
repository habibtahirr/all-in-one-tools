import { useState } from 'react'
function Conv({ modes, fn, ph }: { modes: [string, string][]; fn: (s: string, m: string) => string; ph?: string }) {
  const [t, setT] = useState(''); const [m, setM] = useState(modes[0][0])
  let out = '', err = ''
  if (t) { try { out = fn(t, m) } catch (e) { err = (e as Error).message || 'Invalid input' } }
  return <div className="space-y-3">
    <label className="block text-sm font-medium">Input<textarea className="field mt-1 h-40 font-mono" value={t} placeholder={ph} onChange={e => setT(e.target.value)} /></label>
    <div className="flex flex-wrap gap-2">{modes.map(([k, l]) => <button key={k} className={m === k ? 'btn' : 'btn-2'} aria-pressed={m === k} onClick={() => setM(k)}>{l}</button>)}<button className="btn-2" onClick={() => setT('')}>Reset</button></div>
    {err ? <p role="alert" className="text-red-600">{err}</p> : <><label className="block text-sm font-medium">Result<textarea readOnly className="field mt-1 h-40 font-mono" value={out} /></label>
      <button className="btn-2" onClick={() => navigator.clipboard.writeText(out)}>Copy</button></>}</div>
}
export const JsonFormatter = () => <Conv modes={[['fmt', 'Format'], ['min', 'Minify']]} ph='{"a":1}' fn={(s, m) => JSON.stringify(JSON.parse(s), null, m === 'min' ? 0 : 2)} />
export const Base64Tool = () => <Conv modes={[['enc', 'Encode'], ['dec', 'Decode']]} fn={(s, m) => {
  if (m === 'enc') { let b = ''; new TextEncoder().encode(s).forEach(c => b += String.fromCharCode(c)); return btoa(b) }
  try { return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(s.trim()), c => c.charCodeAt(0))) } catch { throw new Error('Not valid Base64 text.') }
}} />
export const UrlCoder = () => <Conv modes={[['enc', 'Encode'], ['dec', 'Decode']]} fn={(s, m) => { try { return m === 'enc' ? encodeURIComponent(s) : decodeURIComponent(s) } catch { throw new Error('Invalid percent-encoding.') } }} />
export const HtmlEntities = () => <Conv modes={[['enc', 'Encode'], ['dec', 'Decode']]} fn={(s, m) => m === 'enc'
  ? s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[c])
  : (new DOMParser().parseFromString(s, 'text/html').documentElement.textContent || '')} />
export const CssMinifier = () => <Conv modes={[['min', 'Minify']]} ph="a { color: red; }" fn={s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim()} />
export function UuidGenerator() {
  const [n, setN] = useState(1); const [ids, setIds] = useState<string[]>([]); const [err, setErr] = useState('')
  const go = () => { if (!Number.isInteger(n) || n < 1 || n > 100) return setErr('Enter a whole number from 1 to 100.'); if (!crypto.randomUUID) return setErr('This browser needs a secure (https) page to generate UUIDs.'); setErr(''); setIds(Array.from({ length: n }, () => crypto.randomUUID())) }
  return <div className="space-y-3"><label className="block text-sm font-medium">How many (1–100)<input type="number" className="field mt-1 max-w-xs" value={n} onChange={e => setN(+e.target.value)} /></label>
    <button className="btn" onClick={go}>Generate UUID v4</button>{err && <p role="alert" className="text-red-600">{err}</p>}
    {ids.length > 0 && <><textarea readOnly aria-label="UUIDs" className="field h-40 font-mono" value={ids.join('\n')} /><button className="btn-2" onClick={() => navigator.clipboard.writeText(ids.join('\n'))}>Copy</button></>}</div>
}
export function Timestamp() {
  const [v, setV] = useState(''); const [d, setD] = useState('')
  let r = '', err = ''
  if (v.trim()) { const n = Number(v); const dt = new Date(Math.abs(n) > 1e11 ? n : n * 1000); if (!Number.isFinite(n) || isNaN(+dt)) err = 'Enter a valid Unix timestamp (seconds or milliseconds).'; else r = `UTC: ${dt.toISOString()}\nLocal: ${dt.toString()}` }
  const sec = d ? Math.floor(new Date(d).getTime() / 1000) : null
  return <div className="space-y-4"><div className="space-y-2"><label className="block text-sm font-medium">Unix timestamp → date<input className="field mt-1" value={v} onChange={e => setV(e.target.value)} placeholder="1700000000" /></label>
    <button className="btn-2" onClick={() => setV(String(Math.floor(Date.now() / 1000)))}>Use current time</button>
    {err ? <p role="alert" className="text-red-600">{err}</p> : r && <pre className="whitespace-pre-wrap font-semibold text-brand dark:text-blue-400">{r}</pre>}</div>
    <div className="space-y-2"><label className="block text-sm font-medium">Date and time (your local time zone) → timestamp<input type="datetime-local" className="field mt-1" value={d} onChange={e => setD(e.target.value)} /></label>
      {sec !== null && !isNaN(sec) && <p className="font-semibold text-brand dark:text-blue-400">{sec} seconds ({sec * 1000} ms)</p>}</div></div>
}
const W = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur'.split(' ')
export function LoremIpsum() {
  const [n, setN] = useState(3); const bad = !Number.isInteger(n) || n < 1 || n > 20
  const pick = () => W[Math.floor(Math.random() * W.length)]
  const para = () => Array.from({ length: 5 }, () => { const s = Array.from({ length: 8 + Math.floor(Math.random() * 7) }, pick).join(' '); return s[0].toUpperCase() + s.slice(1) + '.' }).join(' ')
  const [out, setOut] = useState('')
  return <div className="space-y-3"><label className="block text-sm font-medium">Paragraphs (1–20)<input type="number" className="field mt-1 max-w-xs" value={n} onChange={e => setN(+e.target.value)} /></label>
    <button className="btn" onClick={() => setOut(Array.from({ length: n }, para).join('\n\n'))} disabled={bad}>Generate</button>{bad && <p role="alert" className="text-red-600">Enter a whole number from 1 to 20.</p>}
    {out && <><textarea readOnly aria-label="Placeholder text" className="field h-56" value={out} /><button className="btn-2" onClick={() => navigator.clipboard.writeText(out)}>Copy</button></>}</div>
}
export function ColorConverter() {
  const [t, setT] = useState('#1d4ed8'); let rgb: number[] | null = null
  const h = t.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (h) { const x = h[1].length === 3 ? h[1].split('').map(c => c + c).join('') : h[1]; rgb = [0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16)) }
  else { const p = t.replace(/rgb\(|\)/gi, '').split(/[\s,]+/).filter(Boolean).map(Number); if (p.length === 3 && p.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) rgb = p }
  return <div className="space-y-3"><label className="block text-sm font-medium">HEX (#1d4ed8) or RGB (29, 78, 216)<input className="field mt-1 max-w-sm" value={t} onChange={e => setT(e.target.value)} /></label>
    {rgb ? <div className="flex items-center gap-4"><div className="h-16 w-16 rounded-lg border border-slate-300" style={{ background: `rgb(${rgb})` }} aria-hidden />
      <p className="font-semibold text-brand dark:text-blue-400">HEX #{rgb.map(n => n.toString(16).padStart(2, '0')).join('')}<br />RGB {rgb.join(', ')}</p></div>
      : <p role="alert" className="text-red-600">Enter a valid HEX code or three RGB values from 0 to 255.</p>}</div>
}
