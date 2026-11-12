export default function Panel({ title, subtitle, actions, children, className = '', bodyClassName = '' }) {
  return (
    <section className={`rounded-xl border border-zinc-800 bg-zinc-900 shadow-xs ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-2 px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={`p-4 sm:p-5 ${title || actions ? 'pt-3 sm:pt-4' : ''} ${bodyClassName}`}>{children}</div>
    </section>
  )
}