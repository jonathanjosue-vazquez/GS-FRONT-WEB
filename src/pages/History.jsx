import { useSearchParams } from 'react-router-dom'
import { Download } from 'lucide-react'
import { useMonitoring } from '../hooks/useMonitoring'
import { useHistory } from '../hooks/useHistory'
import { PERIODS } from '../services/analysis'
import { buildCsv, downloadCsv } from '../services/export'
import { formatLevel, formatTime, formatAge } from '../services/format'
import Panel from '../components/ui/Panel'
import { Select, Segmented, Checkbox, Button } from '../components/ui/Controls'
import { EmptyState } from '../components/ui/States'
import LevelChart from '../components/charts/LevelChart'
import HistoryTable from '../components/history/HistoryTable'

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-zinc-800/90 bg-zinc-900/60 p-3.5">
      <p className="text-[11px] text-zinc-500">{label}</p>
      <p className="mt-1 font-mono text-lg font-semibold text-zinc-100">{value}</p>
      {sub && <p className="font-mono text-[11px] text-zinc-500">{sub}</p>}
    </div>
  )
}

export default function History() {
  const { snapshot } = useMonitoring()
  const { nodes, readings, now } = snapshot
  const [params, setParams] = useSearchParams()
  const h = useHistory({ nodes, readings, now, initialNodeId: params.get('no') ?? undefined })

  if (!h.node) return <EmptyState title="Nenhum nó cadastrado" hint="Cadastre um nó na página Nós ESP32 para consultar o histórico." />

  const { node, result } = h
  const stats = result.stats
  const periodLabel = PERIODS[h.periodKey].label.toLowerCase()

  const changeNode = (id) => {
    h.setNodeId(id)
    setParams({ no: id }, { replace: true })
  }
  const exportCsv = () => downloadCsv(`historico-${node.code}-${h.periodKey}.csv`, buildCsv(node, [...result.rows].reverse()))

  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
          <Select label="Ponto monitorado" value={node.id} onChange={changeNode} className="min-w-52">
            {nodes.map((n) => <option key={n.id} value={n.id}>{n.code} · {n.name}</option>)}
          </Select>
          <div className="flex flex-col gap-1 text-[11px] text-zinc-500">
            Período
            <Segmented
              label="Período" value={h.periodKey} onChange={h.setPeriodKey}
              options={Object.entries(PERIODS).map(([value, p]) => ({ value, label: value === '1h' ? '1 h' : value === '6h' ? '6 h' : '24 h', title: p.label }))}
            />
          </div>
          <div className="flex flex-wrap gap-x-5">
            <Checkbox label="Só acima da cota de atenção" checked={h.onlyAboveAttention} onChange={h.setOnlyAbove} />
            <Checkbox label="Comparar com o período anterior" checked={h.compare} onChange={h.setCompare} />
          </div>
        </div>
      </Panel>

      {node.connection !== 'online' && (
        <p role="status" className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
          {node.connection === 'offline' || node.connection === 'stale'
            ? `Este nó não envia dados recentes: a última leitura foi ${formatAge(node.lastReadingAge)}. O histórico termina nela.`
            : 'Este nó está instável: podem existir lacunas nas leituras.'}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat label="Máximo" value={stats ? `${formatLevel(stats.max.level)} cm` : '—'} sub={stats ? `às ${formatTime(stats.max.t)}` : undefined} />
        <Stat label="Mínimo" value={stats ? `${formatLevel(stats.min.level)} cm` : '—'} sub={stats ? `às ${formatTime(stats.min.t)}` : undefined} />
        <Stat label="Média" value={stats ? `${formatLevel(stats.avg)} cm` : '—'} />
        <Stat label="Amplitude" value={stats ? `${formatLevel(stats.amplitude)} cm` : '—'} />
        <Stat label="Leituras" value={stats ? stats.count : 0} sub={periodLabel} />
      </div>

      <Panel title={`Nível de ${node.code} · ${node.name}`} subtitle={`Leituras de ${periodLabel}, em centímetros`}>
        {result.series.length === 0 ? (
          <EmptyState title="Sem leituras neste período" hint="Escolha um período maior ou outro ponto." />
        ) : (
          <>
            <LevelChart
              series={result.series}
              previous={h.compare ? result.previous : []}
              periodMs={h.periodMs}
              from={result.from} to={result.to}
              attentionLevel={node.attentionLevel} criticalLevel={node.criticalLevel}
              heightClass="h-64 sm:h-80"
            />
            {h.compare && result.previous.length === 0 && (
              <p className="mt-2 text-[11px] text-zinc-500">Não há leituras guardadas no período anterior. A simulação mantém as últimas 24 horas.</p>
            )}
          </>
        )}
      </Panel>

      <Panel
        title="Tabela de medições"
        subtitle={h.onlyAboveAttention ? `Somente leituras acima de ${node.attentionLevel} cm` : 'Da leitura mais recente para a mais antiga'}
        actions={<Button onClick={exportCsv} disabled={result.rows.length === 0}><Download className="h-3.5 w-3.5" aria-hidden="true" />Exportar CSV</Button>}
        bodyClassName="px-0 sm:px-0"
      >
        {result.rows.length === 0 ? (
          <div className="px-4"><EmptyState title="Nenhuma leitura com esses filtros" hint="Desmarque o filtro de cota de atenção ou amplie o período." /></div>
        ) : (
          <div className="px-2"><HistoryTable key={`${node.id}-${h.periodKey}-${h.onlyAboveAttention}`} rows={result.rows} /></div>
        )}
      </Panel>
    </div>
  )
}
