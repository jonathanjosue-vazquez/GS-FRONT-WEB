import { useId, useMemo } from 'react'
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import { downsample } from '../../services/analysis'
import { formatLevel, formatTime, formatDateTime } from '../../services/format'

const SERIES_LABEL = { level: 'Nível', previous: 'Período anterior', projected: 'Projeção linear' }

function ChartTooltip({ active, payload, label, spansDays }) {
  if (!active || !payload?.length) return null
  const entries = payload.filter((p) => p.value != null)
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs shadow-lg">
      <p className="mb-1 text-zinc-400">{spansDays ? formatDateTime(label) : formatTime(label)}</p>
      {entries.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {SERIES_LABEL[p.dataKey] ?? p.name}: {formatLevel(p.value)} cm
        </p>
      ))}
    </div>
  )
}

// Gráfico de nível (cm) com cota de atenção e crítica.
// `series` e `previous` são leituras {t, level}; `previous` é desenhada deslocada em `periodMs`.
// `projection` ({t0, level0, t1, level1}) é uma extrapolação linear simplificada.
export default function LevelChart({
  series, previous = [], periodMs = 0, projection = null,
  from, to, attentionLevel, criticalLevel, color = '#34d399', heightClass = 'h-64 sm:h-72',
}) {
  const gradientId = `lvl${useId().replace(/:/g, '')}`
  const end = projection ? Math.max(to, projection.t1) : to

  const { rows, top } = useMemo(() => {
    const cur = downsample(series, 360).map((r) => ({ t: r.t, level: r.level }))
    const prev = downsample(previous, 360).map((r) => ({ t: r.t + periodMs, previous: r.level }))
    const proj = projection
      ? [{ t: projection.t0, projected: projection.level0 }, { t: projection.t1, projected: projection.level1 }]
      : []
    const all = [...prev, ...cur, ...proj].sort((a, b) => a.t - b.t)
    const maxValue = Math.max(criticalLevel, ...all.map((r) => r.level ?? r.previous ?? r.projected ?? 0))
    return { rows: all, top: Math.ceil((maxValue + 5) / 10) * 10 }
  }, [series, previous, periodMs, projection, criticalLevel])

  const ticks = useMemo(() => Array.from({ length: 5 }, (_, i) => from + ((end - from) * i) / 4), [from, end])
  const spansDays = end - from > 24 * 3_600_000

  return (
    <div className={`w-full ${heightClass}`}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.22} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis
            dataKey="t" type="number" scale="time" domain={[from, end]} ticks={ticks} allowDataOverflow
            tickFormatter={formatTime} stroke="#71717a" tick={{ fontSize: 11, fontFamily: 'ui-monospace, monospace' }} axisLine={{ stroke: '#27272a' }}
          />
          <YAxis domain={[0, top]} stroke="#71717a" tick={{ fontSize: 11, fontFamily: 'ui-monospace, monospace' }} axisLine={false} unit="" />
          <Tooltip content={<ChartTooltip spansDays={spansDays} />} />
          <ReferenceLine
            y={criticalLevel} stroke="#fb7185" strokeDasharray="4 4"
            label={{ value: `Cota crítica (${criticalLevel} cm)`, position: 'insideTopLeft', fill: '#fb7185', fontSize: 10 }}
          />
          <ReferenceLine
            y={attentionLevel} stroke="#fbbf24" strokeDasharray="2 4" strokeOpacity={0.7}
            label={{ value: `Atenção (${attentionLevel} cm)`, position: 'insideBottomLeft', fill: '#fbbf24', fontSize: 10 }}
          />
          <Line dataKey="previous" name="Período anterior" stroke="#a1a1aa" strokeWidth={1.25} strokeDasharray="3 3" dot={false} connectNulls isAnimationActive={false} />
          <Area dataKey="level" name="Nível" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} connectNulls isAnimationActive={false} />
          <Line dataKey="projected" name="Projeção linear" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 4" dot={false} connectNulls isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
