import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { NAV_ITEMS } from './navItems'
import { useMonitoring } from '../../hooks/useMonitoring'
import { LoadingState, ErrorState } from '../ui/States'
import { formatTimeSec } from '../../services/format'

export default function AppLayout() {
  const { snapshot, error, loading, refresh, actions } = useMonitoring()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => e.key === 'Escape' && closeMenu()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, closeMenu])

  const title = NAV_ITEMS.find((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to)))?.label ?? 'PrevIA Hydro'
  const sidebar = <Sidebar alertCount={snapshot?.alerts.active.length ?? 0} onNavigate={closeMenu} onReset={actions.resetSimulation} />

  return (
    <div className="flex h-dvh bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      <aside className="hidden shrink-0 lg:block">{sidebar}</aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button type="button" aria-label="Fechar menu" onClick={closeMenu} className="absolute inset-0 bg-black/70" />
          <aside className="relative h-full">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header title={title} snapshot={snapshot} onMenu={() => setMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          {snapshot && error && (
            <p role="alert" className="mx-auto mb-4 max-w-7xl rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
              Falha ao atualizar. Exibindo os dados de {formatTimeSec(snapshot.now)}.
            </p>
          )}
          <div className="mx-auto max-w-7xl">
            {snapshot ? <Outlet /> : loading ? <LoadingState /> : <ErrorState message={error} onRetry={refresh} />}
          </div>
        </main>
      </div>
    </div>
  )
}
