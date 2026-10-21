import { useEffect, useState } from 'react'
const OK = ['image/png', 'image/jpeg', 'image/webp']
const kb = (n: number) => (n > 1048576 ? (n / 1048576).toFixed(2) + ' MB' : (n / 1024).toFixed(1) + ' KB')
type Res = { url: string; size: number; w: number; h: number; name: string }
function Img({ mode, to }: { mode: 'compress' | 'resize' | 'convert'; to?: string }) {
  const [file, setFile] = useState<File | null>(null); const [err, setErr] = useState(''); const [q, setQ] = useState(0.8)
  const [fmt, setFmt] = useState('image/jpeg'); const [w, setW] = useState(''); const [h, setH] = useState(''); const [res, setRes] = useState<Res | null>(null); const [busy, setBusy] = useState(false)
  useEffect(() => () => { if (res) URL.revokeObjectURL(res.url) }, [res])
  const pick = (f?: File) => { setRes(null); setErr(''); if (!f) return setFile(null); if (!OK.includes(f.type)) { setFile(null); return setErr('Unsupported file. Use PNG, JPG or WebP.') } if (f.size > 25 * 1048576) { setFile(null); return setErr('File is larger than 25 MB.') } setFile(f) }
  const run = async () => {
    if (!file) return; setBusy(true); setErr('')
    try {
      const bmp = await createImageBitmap(file); let W = bmp.width, H = bmp.height
      if (mode === 'resize') {
        const nw = parseInt(w), nh = parseInt(h); if (!nw && !nh) throw new Error('Enter a width or height.')
        if ((nw && (nw < 1 || nw > 8000)) || (nh && (nh < 1 || nh > 8000))) throw new Error('Size must be 1 to 8000 px.')
        if (nw && nh) { W = nw; H = nh } else if (nw) { W = nw; H = Math.round(bmp.height * nw / bmp.width) } else { H = nh; W = Math.round(bmp.width * nh / bmp.height) }
      }
      const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d')!
      const type = mode === 'resize' ? file.type : mode === 'convert' ? to! : fmt
      if (type === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, W, H) }
      x.drawImage(bmp, 0, 0, W, H)
      const b: Blob | null = await new Promise(r => c.toBlob(r, type, q))
      if (!b || b.type !== type) throw new Error('This browser cannot export that format.')
      setRes({ url: URL.createObjectURL(b), size: b.size, w: W, h: H, name: file.name.replace(/\.[^.]+$/, '') + '-' + mode + '.' + type.split('/')[1].replace('jpeg', 'jpg') })
    } catch (e) { setErr((e as Error).message) }
    setBusy(false)
  }
  const lossy = mode === 'compress' || to === 'image/jpeg' || to === 'image/webp'
  return <div className="space-y-3">
    <label className="block text-sm font-medium">Choose an image (PNG, JPG or WebP, up to 25 MB)<input type="file" accept={OK.join(',')} className="field mt-1" onChange={e => pick(e.target.files?.[0])} /></label>
    {mode === 'compress' && <label className="block text-sm font-medium">Output format<select className="field mt-1 max-w-xs" value={fmt} onChange={e => setFmt(e.target.value)}><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select></label>}
    {mode === 'resize' && <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Width (px)<input type="number" className="field mt-1" value={w} onChange={e => setW(e.target.value)} /></label><label className="text-sm font-medium">Height (px, optional)<input type="number" className="field mt-1" value={h} onChange={e => setH(e.target.value)} /></label></div>}
    {lossy && <label className="block text-sm font-medium">Quality: {Math.round(q * 100)}%<input type="range" min={0.1} max={1} step={0.05} value={q} onChange={e => setQ(+e.target.value)} className="w-full" /></label>}
    <div className="flex gap-2"><button className="btn" disabled={!file || busy} onClick={run}>{busy ? 'Processing…' : 'Process image'}</button><button className="btn-2" onClick={() => { pick(undefined); setW(''); setH('') }}>Reset</button></div>
    {err && <p role="alert" className="text-red-600">{err}</p>}
    {res && file && <div className="space-y-2" aria-live="polite"><img src={res.url} alt="Processed result preview" className="max-h-64 rounded-lg border border-slate-300" />
      <p className="text-sm">{kb(file.size)} → <b>{kb(res.size)}</b> · {res.w}×{res.h}px</p>
      {mode === 'compress' && res.size >= file.size && <p className="text-sm text-amber-700">This result is not smaller than the original. Lower the quality or try another format.</p>}
      <a className="btn inline-block" href={res.url} download={res.name}>Download</a></div>}
    <p className="text-sm text-slate-600 dark:text-slate-400">Your image is processed in this browser tab and is never uploaded.</p></div>
}
export const ImageCompressor = () => <Img mode="compress" />
export const ImageResizer = () => <Img mode="resize" />
export const JpgToPng = () => <Img mode="convert" to="image/png" />
export const PngToJpg = () => <Img mode="convert" to="image/jpeg" />
export const WebpConverter = () => <Img mode="convert" to="image/webp" />
export function ImageBase64() {
  const [out, setOut] = useState(''); const [err, setErr] = useState('')
  const pick = (f?: File) => { setOut(''); setErr(''); if (!f) return; if (!f.type.startsWith('image/')) return setErr('Please choose an image file.'); if (f.size > 5 * 1048576) return setErr('Use an image under 5 MB.')
    const r = new FileReader(); r.onload = () => setOut(String(r.result)); r.onerror = () => setErr('Could not read the file.'); r.readAsDataURL(f) }
  return <div className="space-y-3"><label className="block text-sm font-medium">Choose an image (up to 5 MB)<input type="file" accept="image/*" className="field mt-1" onChange={e => pick(e.target.files?.[0])} /></label>
    {err && <p role="alert" className="text-red-600">{err}</p>}
    {out && <><textarea readOnly aria-label="Base64 data URL" className="field h-40 font-mono" value={out} /><button className="btn-2" onClick={() => navigator.clipboard.writeText(out)}>Copy</button></>}</div>
}
