import { AlertTriangle, Droplets } from 'lucide-react'

export function LoadingState({ label = 'Consultando os nós de monitoramento…' }) {
  return (
    <div role="status" className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-zinc-400">
      <Droplets className="h-6 w-6 animate-pulse text-emerald-400" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="mx-auto mt-10 max-w-md rounded-lg border border-rose-500/30 bg-rose-500/5 p-5 text-center">
      <AlertTriangle className="mx-auto h-6 w-6 text-rose-400" aria-hidden="true" />
      <h2 className="mt-2 text-sm font-medium text-zinc-100">Não foi possível carregar os dados</h2>
      <p className="mt-1 text-xs text-zinc-400">{message}</p>
      <button type="button" onClick={onRetry} className="mt-4 min-h-9 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-xs text-zinc-100 hover:border-zinc-500">
        Tentar novamente
      </button>
    </div>
  )
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-800 px-4 py-8 text-center">
      <p className="text-sm text-zinc-300">{title}</p>
      {hint && <p className="mx-auto mt-1 max-w-sm text-xs text-zinc-500">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
