import { Wifi, WifiLow, WifiOff, Clock } from 'lucide-react'
import { RISK_LABELS, CONNECTION_LABELS } from '../../data/domain'
import { toneFor, CONNECTION_TONE } from './tones'

// Selo de risco (nível da água). `risk` nulo = sem leitura confiável.
export function RiskBadge({ risk, className = '' }) {
  const tone = toneFor(risk)
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-medium ${tone.badge} ${className}`}>
      {risk ? RISK_LABELS[risk] : 'Sem dados'}
    </span>
  )
}

const CONNECTION_ICON = { online: Wifi, unstable: WifiLow, stale: Clock, offline: WifiOff }

// Estado de conexão do dispositivo. Visual distinto do selo de risco (ícone + texto, sem caixa).
export function ConnectionBadge({ state, className = '' }) {
  const Icon = CONNECTION_ICON[state] ?? WifiOff
  const tone = CONNECTION_TONE[state] ?? CONNECTION_TONE.offline
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${tone.text} ${className}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {CONNECTION_LABELS[state] ?? state}
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
      {category === 'risk' ? 'Nível da água' : 'Dispositivo'}
    </span>
  )
}
