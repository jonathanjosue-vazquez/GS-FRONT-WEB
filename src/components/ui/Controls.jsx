// Controles reutilizáveis com área de toque confortável.

const buttonBase =
  'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'

const VARIANTS = {
  default: 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-zinc-500',
  primary: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20',
  danger: 'border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20',
  ghost: 'border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
}

export function Button({ variant = 'default', className = '', ...props }) {
  return <button type="button" className={`${buttonBase} ${VARIANTS[variant]} ${className}`} {...props} />
}

export function Select({ label, value, onChange, children, className = '' }) {
  return (
    <label className={`flex flex-col gap-1 text-[11px] text-zinc-500 ${className}`}>
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 font-mono text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none"
      >
        {children}
      </select>
    </label>
  )
}

export function Segmented({ label, value, onChange, options }) {
  return (
    <div role="group" aria-label={label} className="inline-flex overflow-hidden rounded-md border border-zinc-800">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`min-h-9 px-3 text-xs transition-colors ${
            value === o.value ? 'bg-zinc-800 text-emerald-300' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex min-h-9 cursor-pointer items-center gap-2 text-xs text-zinc-300">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-emerald-500" />
      {label}
    </label>
  )
}
