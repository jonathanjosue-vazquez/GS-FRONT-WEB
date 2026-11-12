import { useState } from 'react'
import { useMonitoring } from '../hooks/useMonitoring'
import Panel from '../components/ui/Panel'
import { Segmented } from '../components/ui/Controls'
import { EmptyState } from '../components/ui/States'
import { RiskBadge, ConnectionBadge } from '../components/ui/Badges'
import BasinMap from '../components/monitoring/BasinMap'
import NodeInspector from '../components/monitoring/NodeInspector'
import { formatLevel } from '../services/format'

const FILTERS = {
  all: () => true,
  risk: (n) => n.risk != null && n.risk !== 'normal',
  nodata: (n) => n.risk == null,
}

export default function Monitoring() {
  const { snapshot } = useMonitoring()
  const { nodes } = snapshot
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const visible = nodes.filter(FILTERS[filter])
  const selected = nodes.find((n) => n.id === selectedId) ?? visible[0] ?? nodes[0] ?? null
  const counts = { all: nodes.length, risk: nodes.filter(FILTERS.risk).length, nodata: nodes.filter(FILTERS.nodata).length }

  if (nodes.length === 0) {
    return <EmptyState title="Nenhum ponto cadastrado" hint="Cadastre um nó na página Nós ESP32 para vê-lo no mapa." />
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="min-w-0 space-y-4 lg:col-span-8">
        <Panel
          title="Pontos de monitoramento"
          subtitle="Selecione um ponto para ver o nível, o estado do sensor e o risco."
          actions={
            <Segmented
              label="Filtrar pontos" value={filter} onChange={setFilter}
              options={[
                { value: 'all', label: `Todos (${counts.all})` },
                { value: 'risk', label: `Com risco (${counts.risk})` },
                { value: 'nodata', label: `Sem dados (${counts.nodata})` },
              ]}
            />
          }
        >
          {visible.length === 0 ? (
            <EmptyState title="Nenhum ponto neste filtro" hint="Escolha outro filtro para ver os demais pontos." />
          ) : (
            <BasinMap nodes={visible} selectedId={selected?.id} onSelect={setSelectedId} />
          )}
        </Panel>

        <Panel title="Lista de pontos" subtitle="Mesmas informações do mapa, em formato de lista.">
          <ul className="divide-y divide-zinc-800/70">
            {visible.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(n.id)}
                  aria-pressed={n.id === selected?.id}
                  className={`flex min-h-12 w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 px-2 py-2.5 text-left transition-colors ${
                    n.id === selected?.id ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-medium text-zinc-200">{n.code} · {n.name}</span>
                    <span className="block text-[11px] text-zinc-500">{n.location}</span>
                  </span>
                  <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-mono text-xs text-zinc-300">{n.level != null ? `${formatLevel(n.level)} cm` : '—'}</span>
                    <ConnectionBadge state={n.connection} />
                    <RiskBadge risk={n.risk} />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="lg:col-span-4">
        <NodeInspector node={selected} />
      </div>
    </div>
  )
}
