import { useMonitoring } from '../hooks/useMonitoring'
import { useAlertFilters } from '../hooks/useAlertFilters'
import Panel from '../components/ui/Panel'
import { Select, Segmented, Button } from '../components/ui/Controls'
import { EmptyState } from '../components/ui/States'
import { RiskBadge } from '../components/ui/Badges'
import AlertCard from '../components/alerts/AlertCard'
import { RISK_ORDER, RISK_CRITERIA } from '../data/domain'

export default function Alerts() {
  const { snapshot, actions } = useMonitoring()
  const { nodes, alerts } = snapshot
  const f = useAlertFilters(alerts)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="min-w-0 space-y-4 lg:col-span-8">
        <Panel>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <Segmented
              label="Situação do alerta" value={f.status} onChange={f.setStatus}
              options={[
                { value: 'active', label: `Ativos (${alerts.active.length})` },
                { value: 'history', label: `Anteriores (${alerts.history.length})` },
                { value: 'all', label: 'Todos' },
              ]}
            />
            <Select label="Tipo" value={f.category} onChange={f.setCategory}>
              <option value="all">Todos</option>
              <option value="risk">Nível da água</option>
              <option value="device">Dispositivo</option>
            </Select>
            <Select label="Severidade" value={f.severity} onChange={f.setSeverity}>
              <option value="all">Todas</option>
              {RISK_ORDER.slice(1).map((r) => <option key={r} value={r}>{r === 'attention' ? 'Atenção' : r === 'moderate' ? 'Moderado' : r === 'high' ? 'Alto' : 'Crítico'}</option>)}
            </Select>
            <Select label="Ponto" value={f.nodeId} onChange={f.setNodeId}>
              <option value="all">Todos</option>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.code} · {n.name}</option>)}
            </Select>
            {f.hasFilters && <Button variant="ghost" onClick={f.clear}>Limpar filtros</Button>}
          </div>
        </Panel>

        {f.filtered.length === 0 ? (
          <EmptyState
            title={f.hasFilters ? 'Nenhum alerta com esses filtros' : f.status === 'active' ? 'Nenhum alerta ativo' : 'Nenhum alerta registrado'}
            hint={f.hasFilters ? 'Limpe os filtros para ver todos os alertas.' : 'Os pontos com leitura recente estão em condição normal.'}
            action={f.hasFilters ? <Button onClick={f.clear}>Limpar filtros</Button> : null}
          />
        ) : (
          <div className="space-y-3">
            {f.filtered.map((a) => (
              <AlertCard key={a.id} alert={a} node={nodes.find((n) => n.id === a.nodeId)} onAcknowledge={actions.acknowledgeAlert} />
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-4">
        <Panel title="Como classificamos o risco" subtitle="Regras aplicadas a cada ponto com leitura recente">
          <ul className="space-y-3">
            {RISK_ORDER.map((r) => (
              <li key={r} className="space-y-1">
                <RiskBadge risk={r} />
                <p className="text-xs leading-relaxed text-zinc-400">{RISK_CRITERIA[r]}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-zinc-800 pt-3 text-[11px] leading-relaxed text-zinc-500">
            A tendência usa a taxa dos últimos 10 min e uma projeção linear simplificada. Não é previsão de inundação.
            Problemas de conexão geram alertas de dispositivo, separados do risco. Esta plataforma não substitui a Defesa Civil.
          </p>
        </Panel>
      </div>
    </div>
  )
}
