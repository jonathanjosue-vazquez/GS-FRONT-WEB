import { useMemo, useState } from 'react'
import Panel from '../ui/Panel'
import { Select, Checkbox } from '../ui/Controls'
import { EmptyState } from '../ui/States'
import LevelChart from '../charts/LevelChart'
import { toneFor } from '../ui/tones'
import { formatAge } from '../../services/format'

const WINDOW_MS = 60 * 60_000

export default function WaterLevelPanel({ nodes, readings, now, defaultNodeId }) {
  const [requestedId, setRequestedId] = useState(defaultNodeId)
  const [showProjection, setShowProjection] = useState(false)
  const node = nodes.find((n) => n.id === requestedId) ?? nodes.find((n) => n.id === defaultNodeId) ?? nodes[0]

  const from = now - WINDOW_MS
  const series = useMemo(() => (node ? (readings[node.id] ?? []).filter((r) => r.t >= from && r.t <= now) : []), [node, readings, from, now])

  if (!node) return <Panel title="Curva de elevação do nível"><EmptyState title="Nenhum nó cadastrado" hint="Cadastre um nó na página Nós ESP32 para acompanhar o nível." /></Panel>

  const fresh = node.level != null
  const canProject = fresh && node.ttcMin != null && node.ttcMin > 0
  const projection = showProjection && canProject
    ? (() => {
        const last = series[series.length - 1]
        const minutes = Math.min(node.ttcMin, 60)
        return { t0: last.t, level0: last.level, t1: last.t + minutes * 60_000, level1: last.level + node.rate * minutes }
      })()
    : null

  return (
    <Panel
      title="Curva de elevação do nível (cm)"
      subtitle="Última hora de leituras do sensor ultrassônico"
      actions={
        <Select label="Ponto monitorado" value={node.id} onChange={setRequestedId}>
          {nodes.map((n) => (
            <option key={n.id} value={n.id}>{n.code} · {n.name}{n.level == null ? ' (sem dados recentes)' : ''}</option>
          ))}
        </Select>
      }
    >
      {!fresh && (
        <p role="status" className="mb-3 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-300">
          Este nó não envia dados recentes. A linha termina no último dado recebido
          {node.lastReadingAge != null ? ` (${formatAge(node.lastReadingAge)})` : ''}.
        </p>
      )}
      {series.length === 0 ? (
        <EmptyState title="Sem leituras na última hora" hint="O gráfico volta a aparecer quando o nó enviar novas leituras." />
      ) : (
        <LevelChart
          series={series} projection={projection} from={from} to={now}
          attentionLevel={node.attentionLevel} criticalLevel={node.criticalLevel} color={toneFor(node.risk).hex}
        />
      )}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4">
        <Checkbox label="Mostrar projeção linear (estimativa simplificada)" checked={showProjection} onChange={setShowProjection} />
        {showProjection && !canProject && fresh && <span className="text-[11px] text-zinc-500">Sem tendência de subida: nada a projetar.</span>}
      </div>
    </Panel>
  )
}
