import { CheckCircle2 } from 'lucide-react'
import { RiskBadge, ConnectionBadge, CategoryBadge } from '../ui/Badges'
import { Button } from '../ui/Controls'
import { formatTimeSec, formatDateTime, formatDuration } from '../../services/format'

// Alerta de risco mostra o selo de severidade; alerta de dispositivo mostra o estado de conexão.
export default function AlertCard({ alert, node, compact = false, onAcknowledge }) {
  const active = alert.status === 'active'
  const where = node ? `${node.code} · ${node.name} — ${node.location}` : alert.nodeId
  const time = compact ? formatTimeSec(alert.startedAt) : formatDateTime(alert.startedAt)

  return (
    <article className="space-y-2 rounded-md border border-zinc-800/90 bg-zinc-950 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] text-zinc-500">{alert.id} • {time}</span>
        <span className="flex items-center gap-2">
          {!compact && <CategoryBadge category={alert.category} />}
          {alert.category === 'risk' ? <RiskBadge risk={alert.severity} /> : <ConnectionBadge state={alert.issue} />}
        </span>
      </div>

      <div>
        <h3 className="text-xs font-medium text-zinc-100">{alert.title}</h3>
        <p className="mt-0.5 text-[11px] text-zinc-500">{where}</p>
      </div>

      <p className="border-t border-zinc-800/80 pt-2 text-xs leading-relaxed text-zinc-400">{alert.reason}</p>

      {compact && alert.recommendation?.[0] && (
        <p className="text-xs leading-relaxed text-zinc-300">{alert.recommendation[0]}</p>
      )}

      {!compact && alert.recommendation?.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-zinc-400">Orientação à população</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs leading-relaxed text-zinc-300">
            {alert.recommendation.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      )}
      {!compact && alert.operatorAction && (
        <div>
          <p className="text-[11px] font-medium text-zinc-400">Ação da equipe</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">{alert.operatorAction}</p>
        </div>
      )}

      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {active ? (
            alert.acknowledgedAt ? (
              <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                Reconhecido às {formatTimeSec(alert.acknowledgedAt)}
              </span>
            ) : (
              <Button variant="primary" onClick={() => onAcknowledge(alert.id)}>Reconhecer alerta</Button>
            )
          ) : (
            <span className="text-[11px] text-zinc-500">
              Encerrado às {formatTimeSec(alert.resolvedAt)} • duração {formatDuration(alert.resolvedAt - alert.startedAt)}
              {alert.peakSeverity && alert.peakSeverity !== alert.severity ? ' • pico registrado' : ''}
            </span>
          )}
        </div>
      )}
    </article>
  )
}
