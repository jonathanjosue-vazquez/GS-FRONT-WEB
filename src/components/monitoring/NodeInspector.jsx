import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import Panel from '../ui/Panel'
import { RiskBadge, ConnectionBadge } from '../ui/Badges'
import { toneFor } from '../ui/tones'
import { CONNECTION_HINTS } from '../../data/domain'
import { formatLevel, formatRate, formatEta, formatAge } from '../../services/format'

function Metric({ label, value, unit, valueClass = 'text-zinc-100' }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
      <span className="block text-[11px] text-zinc-500">{label}</span>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className={`font-mono text-xl font-semibold ${valueClass}`}>{value}</span>
        {unit && <span className="font-mono text-xs text-zinc-500">{unit}</span>}
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-mono text-zinc-200">{children}</dd>
    </div>
  )
}

export default function NodeInspector({ node }) {
  if (!node) return null
  const tone = toneFor(node.risk)
  const fresh = node.level != null

  return (
    <Panel className="h-full">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="min-w-0">
          <span className="font-mono text-[11px] font-medium text-emerald-400">{node.id}</span>
          <h3 className="text-base font-semibold text-zinc-100">{node.name}</h3>
          <p className="text-xs text-zinc-500">{node.location} · {node.zone}</p>
        </div>
        <RiskBadge risk={node.risk} />
      </div>

      <div className="mt-3"><ConnectionBadge state={node.connection} /></div>
      <p className="mt-1 text-[11px] text-zinc-500">{CONNECTION_HINTS[node.connection]}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Metric
          label="Nível atual"
          value={fresh ? formatLevel(node.level) : '—'}
          unit={fresh ? 'cm' : ''}
        />
        <Metric
          label="Elevação"
          value={fresh && node.rate != null ? formatRate(node.rate) : '—'}
          unit={fresh && node.rate != null ? 'cm/min' : ''}
          valueClass={fresh ? tone.text : 'text-zinc-100'}
        />
      </div>
      {!fresh && node.lastKnownLevel != null && (
        <p className="mt-2 text-[11px] text-zinc-500">Último dado recebido: {formatLevel(node.lastKnownLevel)} cm ({formatAge(node.lastReadingAge)}). Desatualizado.</p>
      )}

      <dl className="mt-4 space-y-2 rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 text-xs">
        <Row label="Cota de atenção">{node.attentionLevel} cm</Row>
        <Row label="Cota crítica">{node.criticalLevel} cm</Row>
        <Row label="Tempo até a cota crítica">{fresh ? formatEta(node.ttcMin) : '—'}</Row>
        <Row label="Última comunicação">{formatAge(node.lastCommunicationAge)}</Row>
        <Row label="Última leitura">{formatAge(node.lastReadingAge)}</Row>
      </dl>

      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-950 p-3.5">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-zinc-300">
          <strong className="block font-semibold text-emerald-400">Sinalização local (LED e buzzer)</strong>
          {node.connection === 'offline'
            ? 'Sem comunicação, esta plataforma não consegue confirmar o estado da sinalização local. Verifique em campo.'
            : 'Previsto no projeto: o nó sinaliza localmente mesmo sem internet. A plataforma não controla esse acionamento.'}
        </p>
      </div>

      <Link to={`/historico?no=${node.id}`} className="mt-4 inline-flex min-h-9 items-center text-xs font-medium text-emerald-400 hover:text-emerald-300">
        Ver série histórica deste ponto
      </Link>
    </Panel>
  )
}