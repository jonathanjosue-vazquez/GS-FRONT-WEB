import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '../ui/Controls'
import { RiskBadge, ConnectionBadge } from '../ui/Badges'
import { CONNECTION_HINTS } from '../../data/domain'
import { formatAge, formatLevel, formatRate, formatDateTime } from '../../services/format'

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-3 py-1.5">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-mono text-zinc-200">{children}</dd>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="mb-1 text-[11px] font-medium text-zinc-400">{title}</h3>
      <dl className="divide-y divide-zinc-800/60 rounded border border-zinc-800 bg-zinc-900/40 px-3 text-xs">{children}</dl>
    </section>
  )
}

export default function DeviceDetail({ node, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const fresh = node.level != null
  const intervalText = node.reportIntervalSec < 60 ? `${node.reportIntervalSec} s` : `${node.reportIntervalSec / 60} min`

  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-[11px] text-emerald-400">{node.id}</p>
        <p className="text-base font-medium text-zinc-100">{node.name}</p>
        <p className="text-xs text-zinc-500">{node.code} · {node.location} · {node.zone}</p>
      </div>

      <div className="space-y-1">
        <ConnectionBadge state={node.connection} />
        <p className="text-[11px] text-zinc-500">{CONNECTION_HINTS[node.connection]}</p>
      </div>

      <Section title="Comunicação">
        <Row label="Última comunicação">{node.lastCommunication ? `${formatDateTime(node.lastCommunication)} (${formatAge(node.lastCommunicationAge)})` : 'Nunca'}</Row>
        <Row label="Última leitura">{node.lastReadingAt ? `${formatDateTime(node.lastReadingAt)} (${formatAge(node.lastReadingAge)})` : 'Nunca'}</Row>
        <Row label="Envio esperado">a cada {intervalText}</Row>
        <Row label="Perda de pacotes">{node.packetLossPct == null ? '—' : `${node.packetLossPct}%`}</Row>
        <Row label="Bateria">{node.batteryPct == null ? '—' : `${node.batteryPct}%`}</Row>
      </Section>
      <p className="-mt-2 text-[11px] text-zinc-500">Bateria e perda de pacotes são valores simulados.</p>

      <Section title="Nível da água">
        <Row label="Cota atual">{fresh ? `${formatLevel(node.level)} cm` : `— (último: ${formatLevel(node.lastKnownLevel)} cm, antigo)`}</Row>
        <Row label="Elevação">{fresh && node.rate != null ? `${formatRate(node.rate)} cm/min` : '—'}</Row>
        <Row label="Risco"><RiskBadge risk={node.risk} /></Row>
        <Row label="Cota de atenção">{node.attentionLevel} cm</Row>
        <Row label="Cota crítica">{node.criticalLevel} cm</Row>
      </Section>

      <div className="flex flex-wrap gap-2">
        <Button onClick={onEdit}><Pencil className="h-3.5 w-3.5" aria-hidden="true" />Editar</Button>
        <Link to={`/historico?no=${node.id}`} className="inline-flex min-h-9 items-center rounded-md border border-zinc-700 bg-zinc-900 px-3 text-xs text-zinc-100 hover:border-zinc-500">
          Ver histórico
        </Link>
        {!confirming && <Button variant="danger" onClick={() => setConfirming(true)}><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Excluir</Button>}
      </div>

      {confirming && (
        <div role="alert" className="space-y-2 rounded-md border border-rose-500/30 bg-rose-500/5 p-3">
          <p className="text-xs text-zinc-200">Excluir {node.id}? O ponto e o histórico simulado deste nó serão removidos.</p>
          <div className="flex gap-2">
            <Button variant="danger" onClick={onDelete}>Confirmar exclusão</Button>
            <Button onClick={() => setConfirming(false)}>Cancelar</Button>
          </div>
        </div>
      )}
    </div>
  )
}
