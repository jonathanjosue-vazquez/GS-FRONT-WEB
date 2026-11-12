import { ArrowUpRight, ArrowDownRight, Droplets, Clock, Sliders } from 'lucide-react'
import MetricCard from '../ui/MetricCard'
import { toneFor } from '../ui/tones'
import { formatLevel, formatRate, formatEta } from '../../services/format'
import { RULES } from '../../services/analysis'

function etaNote(node) {
  if (node.level >= node.criticalLevel) return 'Cota crítica atingida.'
  if (node.rate == null) return 'Taxa indisponível: poucas leituras recentes.'
  if (node.ttcMin == null) return 'Sem tendência de subida: não há projeção.'
  return 'Projeção linear simplificada. Não é uma previsão de inundação.'
}

export default function MetricStrip({ focus, integrity }) {
  const tone = toneFor(focus?.risk)
  const pct = focus ? Math.min(100, (focus.level / focus.criticalLevel) * 100) : 0
  const rising = focus?.rate != null && focus.rate >= RULES.MIN_RISING_RATE
  const RateIcon = focus?.rate != null && focus.rate < 0 ? ArrowDownRight : ArrowUpRight
  const integrityOk = integrity.providing === integrity.total

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label={focus ? `Cota atual (${focus.code})` : 'Cota atual'}
        icon={Droplets}
        value={focus ? formatLevel(focus.level) : '—'}
        unit={focus ? `cm / ${focus.criticalLevel} cm` : undefined}
        note={focus ? `${focus.name} — ${focus.location}. Atenção em ${focus.attentionLevel} cm.` : 'Nenhum ponto com leitura recente.'}
      >
        {focus && (
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800" role="img" aria-label={`${Math.round(pct)}% da cota crítica`}>
            <div className={`h-full ${tone.bar}`} style={{ width: `${pct}%` }} />
          </div>
        )}
      </MetricCard>

      <MetricCard
        label="Taxa de elevação"
        icon={RateIcon}
        iconClass={rising ? tone.text : 'text-zinc-500'}
        value={focus?.rate != null ? formatRate(focus.rate) : '—'}
        valueClass={rising ? tone.text : 'text-zinc-100'}
        unit="cm/min"
        note={focus?.rate != null ? `Regressão linear das leituras dos últimos ${RULES.RATE_WINDOW_MIN} min.` : 'Dados insuficientes para calcular a taxa.'}
      />

      <MetricCard
        label="Tempo até a cota crítica"
        icon={Clock}
        iconClass={focus?.ttcMin != null ? tone.text : 'text-zinc-500'}
        value={focus ? formatEta(focus.ttcMin) : '—'}
        valueClass={focus?.ttcMin != null ? tone.text : 'text-zinc-100'}
        note={focus ? etaNote(focus) : 'Sem leitura recente para estimar.'}
      />

      <MetricCard
        label="Integridade da rede"
        icon={Sliders}
        value={integrity.pct == null ? '—' : `${Math.round(integrity.pct)}%`}
        valueClass={integrityOk ? 'text-emerald-400' : 'text-amber-400'}
        unit={`${integrity.providing} de ${integrity.total} nós`}
        note="Nós com leitura recente (online ou instáveis) ÷ nós cadastrados."
      />
    </div>
  )
}
