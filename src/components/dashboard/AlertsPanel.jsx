import { Link } from 'react-router-dom'
import { Terminal } from 'lucide-react'
import Panel from '../ui/Panel'
import { EmptyState } from '../ui/States'
import AlertCard from '../alerts/AlertCard'

export default function AlertsPanel({ alerts, nodes, limit = 3 }) {
  const shown = alerts.slice(0, limit)
  const rest = alerts.length - shown.length
  return (
    <Panel
      title={<span className="flex items-center gap-2"><Terminal className="h-4 w-4 text-amber-400" aria-hidden="true" />Ocorrências e orientações</span>}
      actions={<span className="font-mono text-[11px] text-zinc-500">{alerts.length} ativas</span>}
      className="flex h-full flex-col"
      bodyClassName="flex flex-1 flex-col"
    >
      {shown.length === 0 ? (
        <EmptyState title="Nenhum alerta ativo" hint="Os pontos com leitura recente estão em condição normal." />
      ) : (
        <div className="space-y-3">
          {shown.map((a) => <AlertCard key={a.id} alert={a} node={nodes.find((n) => n.id === a.nodeId)} compact />)}
        </div>
      )}
      <Link to="/alertas" className="mt-auto inline-flex min-h-9 items-center pt-3 text-xs text-emerald-400 hover:text-emerald-300">
        {rest > 0 ? `Ver todos os alertas (+${rest})` : 'Abrir central de alertas'}
      </Link>
    </Panel>
  )
}
