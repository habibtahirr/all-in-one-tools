import { useState, type ReactNode } from 'react'
type F = { k: string; label: string; type?: string; step?: string }
const num = (v: string, name: string) => {
  if (v.trim() === '' || !Number.isFinite(Number(v))) throw new Error(`Enter a valid number for "${name}".`)
  return Number(v)
}
const fmt = (n: number) => (Math.round(n * 10000) / 10000).toLocaleString()
function Form({ fields, run, title }: { fields: F[]; run: (v: Record<string, string>) => ReactNode; title?: string }) {
  const [v, setV] = useState<Record<string, string>>({})
  let out: ReactNode = null, err = ''
  if (fields.every(f => (v[f.k] ?? '') !== '')) { try { out = run(v) } catch (e) { err = (e as Error).message } }
  return <section className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
    {title && <h2 className="font-semibold">{title}</h2>}
    <div className="grid gap-3 sm:grid-cols-2">{fields.map(f => <label key={f.k} className="text-sm font-medium">{f.label}
      <input className="field mt-1" type={f.type || 'number'} step={f.step || 'any'} value={v[f.k] ?? ''} onChange={e => setV({ ...v, [f.k]: e.target.value })} /></label>)}</div>
    <button className="btn-2" onClick={() => setV({})}>Reset</button>
    <div aria-live="polite">{err ? <p role="alert" className="text-red-600">{err}</p> : out && <p className="text-lg font-semibold text-brand dark:text-blue-400">{out}</p>}</div></section>
}
export const Percentage = () => <div className="space-y-4">
  <Form title="What is X% of Y?" fields={[{ k: 'p', label: 'Percentage (X)' }, { k: 'y', label: 'Number (Y)' }]}
    run={v => { const p = num(v.p, 'X'), y = num(v.y, 'Y'); return `${fmt(p)}% of ${fmt(y)} = ${fmt(p / 100 * y)}` }} />
  <Form title="X is what percent of Y?" fields={[{ k: 'x', label: 'X' }, { k: 'y', label: 'Y' }]}
    run={v => { const x = num(v.x, 'X'), y = num(v.y, 'Y'); if (y === 0) throw new Error('Y cannot be zero.'); return `${fmt(x)} is ${fmt(x / y * 100)}% of ${fmt(y)}` }} />
  <Form title="Percentage change" fields={[{ k: 'a', label: 'Old value' }, { k: 'b', label: 'New value' }]}
    run={v => { const a = num(v.a, 'Old value'), b = num(v.b, 'New value'); if (a === 0) throw new Error('Old value cannot be zero.'); const c = (b - a) / Math.abs(a) * 100; return `${c >= 0 ? 'Increase' : 'Decrease'} of ${fmt(Math.abs(c))}%` }} /></div>
export const Discount = () => <Form fields={[{ k: 'p', label: 'Original price' }, { k: 'd', label: 'Discount (%)' }]}
  run={v => { const p = num(v.p, 'Original price'), d = num(v.d, 'Discount'); if (p < 0) throw new Error('Price cannot be negative.'); if (d < 0 || d > 100) throw new Error('Discount must be between 0 and 100.')
    return `You save ${fmt(p * d / 100)}. Final price: ${fmt(p * (1 - d / 100))}` }} />
export const Margin = () => <Form fields={[{ k: 'c', label: 'Cost' }, { k: 'r', label: 'Selling price (revenue)' }]}
  run={v => { const c = num(v.c, 'Cost'), r = num(v.r, 'Selling price'); if (c < 0 || r <= 0) throw new Error('Cost must be 0 or more and selling price above 0.')
    return `Profit ${fmt(r - c)} · Margin ${fmt((r - c) / r * 100)}% · Markup ${c ? fmt((r - c) / c * 100) + '%' : 'n/a'}` }} />
export const Bmi = () => <div className="space-y-3"><Form fields={[{ k: 'w', label: 'Weight (kg)' }, { k: 'h', label: 'Height (cm)' }]}
  run={v => { const w = num(v.w, 'Weight'), h = num(v.h, 'Height'); if (w < 2 || w > 500) throw new Error('Weight must be 2–500 kg.'); if (h < 50 || h > 272) throw new Error('Height must be 50–272 cm.')
    const b = w / ((h / 100) ** 2); const cat = b < 18.5 ? 'under 18.5 (underweight range)' : b < 25 ? '18.5–24.9 (healthy range)' : b < 30 ? '25–29.9 (overweight range)' : '30 or above (obesity range)'
    return `BMI = ${w} ÷ (${h / 100})² = ${b.toFixed(1)} — ${cat}` }} />
  <p className="text-sm text-slate-600 dark:text-slate-400">Informational only, not medical advice. BMI does not account for muscle mass, age, sex or body composition and is not suitable for children. Ask a health professional about your results.</p></div>
const parse = (s: string, n: string) => { const d = new Date(s + 'T00:00:00'); if (isNaN(+d)) throw new Error(`Enter a valid ${n}.`); return d }
export const AgeCalc = () => <Form fields={[{ k: 'b', label: 'Date of birth', type: 'date' }, { k: 't', label: 'Age at date', type: 'date' }]}
  run={v => { const b = parse(v.b, 'birth date'), t = parse(v.t, 'target date'); if (b > t) throw new Error('Birth date must be on or before the target date.')
    let y = t.getFullYear() - b.getFullYear(), m = t.getMonth() - b.getMonth(), d = t.getDate() - b.getDate()
    if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate() } if (m < 0) { y--; m += 12 }
    return `${y} years, ${m} months, ${d} days` }} />
export const DateDiff = () => <Form fields={[{ k: 'a', label: 'Start date', type: 'date' }, { k: 'b', label: 'End date', type: 'date' }]}
  run={v => { const a = parse(v.a, 'start date'), b = parse(v.b, 'end date'); const days = Math.round(Math.abs(+b - +a) / 864e5)
    return `${fmt(days)} days (${fmt(Math.floor(days / 7))} weeks and ${days % 7} days)` }} />
const U: Record<string, Record<string, number>> = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.344, yard: 0.9144, foot: 0.3048, inch: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.45359237, oz: 0.028349523125 },
  volume: { litre: 1, ml: 0.001, 'US gallon': 3.785411784, 'US cup': 0.2365882365 },
  temperature: { C: 1, F: 1, K: 1 },
}
export function UnitConverter() {
  const [cat, setCat] = useState('length'); const units = Object.keys(U[cat]); const [from, setFrom] = useState('m'); const [to, setTo] = useState('km'); const [val, setVal] = useState('')
  const change = (c: string) => { setCat(c); const u = Object.keys(U[c]); setFrom(u[0]); setTo(u[1]) }
  let out = '', err = ''
  if (val !== '') { try { const n = num(val, 'Value')
    if (cat === 'temperature') { const c = from === 'C' ? n : from === 'F' ? (n - 32) * 5 / 9 : n - 273.15; if (c < -273.15) throw new Error('Below absolute zero.'); out = fmt(to === 'C' ? c : to === 'F' ? c * 9 / 5 + 32 : c + 273.15) }
    else out = fmt(n * U[cat][from] / U[cat][to]) } catch (e) { err = (e as Error).message } }
  const S = (v: string, set: (s: string) => void, l: string, o: string[]) => <label className="text-sm font-medium">{l}<select className="field mt-1" value={v} onChange={e => set(e.target.value)}>{o.map(x => <option key={x}>{x}</option>)}</select></label>
  return <div className="space-y-3"><div className="grid gap-3 sm:grid-cols-4">{S(cat, change, 'Type', Object.keys(U))}
    <label className="text-sm font-medium">Value<input type="number" step="any" className="field mt-1" value={val} onChange={e => setVal(e.target.value)} /></label>{S(from, setFrom, 'From', units)}{S(to, setTo, 'To', units)}</div>
    <div aria-live="polite">{err ? <p role="alert" className="text-red-600">{err}</p> : out && <p className="text-lg font-semibold text-brand dark:text-blue-400">{val} {from} = {out} {to}</p>}</div></div>
}
export function TimeDuration() {
  const [t, setT] = useState(''); let out = '', err = ''
  const lines = t.split('\n').map(s => s.trim()).filter(Boolean)
  if (lines.length) { let s = 0
    for (const l of lines) { const p = l.split(':').map(Number); if (p.length < 2 || p.length > 3 || p.some(n => !Number.isInteger(n) || n < 0) || p[1] > 59 || (p[2] ?? 0) > 59) { err = `"${l}" is not a valid duration. Use h:mm or h:mm:ss.`; break } s += p[0] * 3600 + p[1] * 60 + (p[2] ?? 0) }
    if (!err) out = `Total ${Math.floor(s / 3600)}:${String(Math.floor(s % 3600 / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')} (${fmt(s / 3600)} hours)` }
  return <div className="space-y-3"><label className="block text-sm font-medium">Durations, one per line (h:mm or h:mm:ss)<textarea className="field mt-1 h-40 font-mono" value={t} onChange={e => setT(e.target.value)} placeholder={'1:30\n0:45:30'} /></label>
    <button className="btn-2" onClick={() => setT('')}>Reset</button><div aria-live="polite">{err ? <p role="alert" className="text-red-600">{err}</p> : out && <p className="text-lg font-semibold text-brand dark:text-blue-400">{out}</p>}</div></div>
}
