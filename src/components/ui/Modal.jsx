import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Janela sobreposta acessível: fecha com Esc e devolve o foco ao elemento anterior.
export default function Modal({ title, onClose, children, side = false }) {
  const panelRef = useRef(null)

  useEffect(() => {
    const previous = document.activeElement
    panelRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex" role="presentation">
      <button type="button" aria-label="Fechar" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/70" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={`relative flex max-h-full flex-col overflow-hidden border-zinc-800 bg-zinc-950 shadow-2xl outline-none ${
          side ? 'ml-auto h-full w-full max-w-md border-l' : 'm-auto w-[calc(100%-1.5rem)] max-w-lg rounded-lg border'
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-sm font-medium text-zinc-100">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="rounded p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}
