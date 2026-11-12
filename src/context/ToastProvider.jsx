import { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'
import { ToastContext } from './monitoringContext'

let nextId = 1

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const id = setTimeout(() => onClose(toast.id), 4500)
    return () => clearTimeout(id)
  }, [toast.id, onClose])

  const isError = toast.type === 'error'
  const Icon = isError ? AlertTriangle : CheckCircle2
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`flex items-start gap-2.5 rounded-md border bg-zinc-900 px-3 py-2.5 text-xs shadow-lg ${
        isError ? 'border-rose-500/40 text-rose-200' : 'border-emerald-500/30 text-zinc-100'
      }`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${isError ? 'text-rose-400' : 'text-emerald-400'}`} aria-hidden="true" />
      <span className="flex-1 leading-relaxed">{toast.message}</span>
      <button type="button" onClick={() => onClose(toast.id)} aria-label="Fechar aviso" className="text-zinc-500 hover:text-zinc-200">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const close = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), [])
  const push = useCallback((type, message) => setToasts((list) => [...list, { id: nextId++, type, message }]), [])
  const api = useMemo(() => ({ success: (m) => push('success', m), error: (m) => push('error', m) }), [push])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-3 bottom-3 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full">
            <ToastItem toast={t} onClose={close} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
