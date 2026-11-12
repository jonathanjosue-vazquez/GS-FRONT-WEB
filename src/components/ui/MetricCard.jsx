export default function MetricCard({ label, icon: Icon, iconClass = 'text-zinc-500', value, unit, valueClass = 'text-zinc-100', note, noteClass = 'text-zinc-500', children }) {
  return (
    <div className="rounded-lg border border-zinc-800/90 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
        <span>{label}</span>
        {Icon && <Icon className={`h-3.5 w-3.5 ${iconClass}`} aria-hidden="true" />}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`font-mono text-2xl font-semibold ${valueClass}`}>{value}</span>
        {unit && <span className="font-mono text-xs text-zinc-500">{unit}</span>}
      </div>
      {children}
      {note && <p className={`mt-2 text-[11px] leading-snug ${noteClass}`}>{note}</p>}
    </div>
  )
}
