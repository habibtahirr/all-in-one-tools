import { useState } from 'react'
function rnd(n: number) { // unbiased integer in [0,n)
  const max = Math.floor(0x100000000 / n) * n; const a = new Uint32Array(1)
  do { crypto.getRandomValues(a) } while (a[0] >= max)
  return a[0] % n
}
export function PasswordGenerator() {
  const [len, setLen] = useState(16); const [o, setO] = useState({ lo: true, up: true, nu: true, sy: true }); const [pw, setPw] = useState(''); const [err, setErr] = useState('')
  const sets: Record<string, string> = { lo: 'abcdefghijklmnopqrstuvwxyz', up: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', nu: '0123456789', sy: '!@#$%^&*()-_=+[]{};:,.?' }
  const gen = () => {
    const act = (Object.keys(o) as (keyof typeof o)[]).filter(k => o[k]).map(k => sets[k])
    if (!act.length) return setErr('Select at least one character type.')
    if (len < act.length || len > 128) return setErr('Length must be between ' + act.length + ' and 128.')
    setErr(''); const all = act.join(''); const c = act.map(s => s[rnd(s.length)])
    while (c.length < len) c.push(all[rnd(all.length)])
    for (let i = c.length - 1; i > 0; i--) { const j = rnd(i + 1); [c[i], c[j]] = [c[j], c[i]] }
    setPw(c.join(''))
  }
  return <div className="space-y-3"><label className="block text-sm font-medium">Length: {len}<input type="range" min={8} max={64} value={len} onChange={e => setLen(+e.target.value)} className="w-full" /></label>
    <div className="flex flex-wrap gap-4 text-sm">{([['lo', 'a–z'], ['up', 'A–Z'], ['nu', '0–9'], ['sy', 'Symbols']] as const).map(([k, l]) =>
      <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={o[k]} onChange={e => setO({ ...o, [k]: e.target.checked })} />{l}</label>)}</div>
    <button className="btn" onClick={gen}>Generate password</button>
    {err && <p role="alert" className="text-red-600">{err}</p>}
    {pw && <div><input aria-label="Generated password" readOnly className="field font-mono" value={pw} /><button className="btn-2 mt-2" onClick={() => navigator.clipboard.writeText(pw)}>Copy</button></div>}
    <p className="text-sm text-slate-600 dark:text-slate-400">Generated in your browser with crypto.getRandomValues. Nothing is sent or stored.</p></div>
}
export function RandomNumber() {
  const [v, set] = useState({ min: '1', max: '100', n: '1' }); const [res, setRes] = useState(''); const [err, setErr] = useState('')
  const go = () => {
    const a = Number(v.min), b = Number(v.max), n = Number(v.n)
    if (![a, b, n].every(Number.isInteger)) return setErr('Use whole numbers only.')
    if (a > b) return setErr('Minimum cannot be greater than maximum.')
    if (b - a >= 0xffffffff) return setErr('Range is too large.')
    if (n < 1 || n > 1000) return setErr('Count must be between 1 and 1000.')
    setErr(''); setRes(Array.from({ length: n }, () => a + rnd(b - a + 1)).join(', '))
  }
  return <div className="space-y-3"><div className="grid gap-3 sm:grid-cols-3">{([['min', 'Minimum'], ['max', 'Maximum'], ['n', 'How many']] as const).map(([k, l]) =>
    <label key={k} className="text-sm font-medium">{l}<input type="number" className="field mt-1" value={v[k]} onChange={e => set({ ...v, [k]: e.target.value })} /></label>)}</div>
    <button className="btn" onClick={go}>Generate</button>{err && <p role="alert" className="text-red-600">{err}</p>}
    {res && <p className="break-words text-lg font-semibold" aria-live="polite">{res}</p>}</div>
}
