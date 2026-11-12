import { NavLink } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { NAV_ITEMS } from './navItems'
import logoIcon from '../../assets/logo-icon.png'

export default function Sidebar({ alertCount, onNavigate, onReset }) {
  return (
    <div className="flex h-full w-60 flex-col justify-between bg-[#0b2545] text-slate-200">
      <div>
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2.5">
            <img
              src={logoIcon}
              alt="PrevIA Hydro"
              className="h-7 w-7 shrink-0 object-contain"
            />
            <span className="text-sm font-bold tracking-tight text-white">
              PrevIA <span className="font-mono font-semibold text-sky-300">HYDRO</span>
            </span>
          </div>
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-sky-200">
            v0.3
          </span>
        </div>

        <nav aria-label="Principal" className="p-3">
          <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-sky-200/50">
            Centro de Operação
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex min-h-10 items-center justify-between rounded-lg px-3 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-sky-500/20 text-white shadow-xs ring-1 ring-sky-400/30'
                        : 'text-slate-300/80 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${isActive ? 'text-sky-300' : 'text-slate-400'}`}
                          aria-hidden="true"
                        />
                        {label}
                      </span>
                      {to === '/alertas' && alertCount > 0 && (
                        <span
                          aria-label={`${alertCount} alertas ativos`}
                          className="rounded-full bg-amber-400 px-1.5 py-0.2 font-mono text-[10px] font-bold text-slate-950"
                        >
                          {alertCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="space-y-2 rounded-lg bg-white/5 p-3 ring-1 ring-white/10">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-medium text-sky-200">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" aria-hidden="true" />
              Telemetria simulada
            </span>
            <span className="font-mono text-[10px] text-sky-200/60">GS-26.2</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300/70">
            Ambiente de demonstração. Os dados não representam alertas oficiais da Defesa Civil.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="flex min-h-8 w-full items-center justify-center gap-1.5 rounded-md bg-white/10 text-[11px] font-medium text-white transition-colors hover:bg-white/20"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reiniciar simulação
          </button>
        </div>
      </div>
    </div>
  )
}