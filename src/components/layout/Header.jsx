import { Menu, Radio, AlertTriangle } from 'lucide-react'
import { AREA_NAME, RISK_LABELS } from '../../data/domain'
import { toneFor } from '../ui/tones'
import { formatTimeSec } from '../../services/format'

export default function Header({ title, snapshot, onMenu }) {
  const risk = snapshot?.overallRisk ?? null
  const tone = toneFor(risk)
  const integrity = snapshot?.integrity

  return (
    <header className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-zinc-800 bg-zinc-900 px-3 py-2 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenu}
          aria-label="Abrir menu de navegação"
          className="-ml-1 flex h-10 w-10 items-center justify-center rounded-md text-zinc-300 hover:bg-zinc-950 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-sm font-semibold text-zinc-100">{title}</h1>
        <span className="hidden text-zinc-700 sm:inline">/</span>
        <span className="hidden truncate font-mono text-xs text-zinc-500 sm:inline">{AREA_NAME}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {snapshot && (
          <span className="hidden font-mono text-[11px] text-zinc-500 md:inline" title="Última atualização dos dados">
            Atualizado às {formatTimeSec(snapshot.now)}
          </span>
        )}
        {integrity && (
          <div
            className="flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1 font-mono text-xs text-zinc-200"
            title="Nós enviando leituras recentes (online ou instáveis)"
          >
            <Radio className={`h-3.5 w-3.5 ${integrity.providing === integrity.total ? 'text-emerald-500' : 'text-amber-500'}`} aria-hidden="true" />
            <span>{integrity.providing}/{integrity.total} nós online</span>
          </div>
        )}
        {snapshot && (
          <div
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium ${tone.badge}`}
            title="Maior risco entre os pontos com leitura recente"
          >
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{risk ? `Risco ${RISK_LABELS[risk].toLowerCase()}` : 'Sem dados'}</span>
          </div>
        )}
      </div>
    </header>
  )
}