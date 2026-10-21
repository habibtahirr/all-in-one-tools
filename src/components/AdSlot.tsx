// Placeholder only. After AdSense approval, replace the body with the official snippet from your AdSense account.
export default function AdSlot({ label = 'Advertisement placeholder' }: { label?: string }) {
  return <div role="complementary" aria-label="Advertisement" className="my-8 flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-500 dark:border-slate-600">{label}</div>
}
