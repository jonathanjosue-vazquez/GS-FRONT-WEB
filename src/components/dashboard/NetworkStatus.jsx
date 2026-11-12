import { Link } from 'react-router-dom'
import Panel from '../ui/Panel'
import { ConnectionBadge } from '../ui/Badges'
import { formatAge, formatLevel } from '../../services/format'

export default function NetworkStatus({ nodes }) {
  return (
    <Panel title="Integridade da rede" subtitle="Estado de conexão dos nós ESP32, independente do risco do ponto" actions={
      <Link to="/nos" className="inline-flex min-h-9 items-center text-xs text-emerald-400 hover:text-emerald-300">Ver nós</Link>
    }>
      <ul className="divide-y divide-zinc-800/70">
        {nodes.map((n) => (
          <li key={n.id} className="grid gap-x-4 gap-y-1 py-2.5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-zinc-200">{n.code} · {n.name}</p>
              <p className="truncate font-mono text-[11px] text-zinc-500">{n.id}</p>
            </div>
            <p className="font-mono text-[11px] text-zinc-400">Comunicou {formatAge(n.lastCommunicationAge)}</p>
            <p className="font-mono text-[11px] text-zinc-400">
              {n.level != null
                ? `Cota ${formatLevel(n.level)} cm`
                : n.lastKnownLevel != null ? `Último dado: ${formatLevel(n.lastKnownLevel)} cm (antigo)` : 'Sem leitura'}
            </p>
            <ConnectionBadge state={n.connection} />
          </li>
        ))}
      </ul>
    </Panel>
  )
}
