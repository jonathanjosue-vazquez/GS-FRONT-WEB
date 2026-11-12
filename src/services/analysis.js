// Funções puras de análise. Sem React, sem relógio global: tudo recebe `now`.
// Cobertas por analysis.test.js (npm test).

export const RULES = {
  RATE_WINDOW_MIN: 10,        // janela da regressão linear
  RATE_MIN_POINTS: 3,         // mínimo de leituras na janela
  RATE_MIN_SPAN_MIN: 3,       // e cobertura mínima da janela
  MIN_RISING_RATE: 0.02,      // cm/min; abaixo disso não há tendência de subida
  ATTENTION_RATE: 0.12,       // cm/min para classificar "Atenção"
  HIGH_RATIO: 0.85,           // fração da cota crítica
  HIGH_ETA_MIN: 15,
  MODERATE_ETA_MIN: 60,
  OFFLINE_AFTER_INTERVALS: 20, // sem comunicação por 20 intervalos → offline
  STALE_AFTER_INTERVALS: 6,    // sem leitura por 6 intervalos → dados desatualizados
  UNSTABLE_PACKET_LOSS: 20,    // % de perda de pacotes
}

const MIN_MS = 60_000

// Taxa de elevação (cm/min) por mínimos quadrados nas leituras dos últimos
// RATE_WINDOW_MIN minutos antes de `endT`. Retorna null se faltarem dados.
export function estimateRate(readings, endT) {
  if (!readings?.length) return null
  const from = endT - RULES.RATE_WINDOW_MIN * MIN_MS
  const pts = []
  for (let i = readings.length - 1; i >= 0 && readings[i].t >= from; i--) {
    if (readings[i].t <= endT) pts.push(readings[i])
  }
  if (pts.length < RULES.RATE_MIN_POINTS) return null
  const t0 = pts[pts.length - 1].t
  const span = (pts[0].t - t0) / MIN_MS
  if (span < RULES.RATE_MIN_SPAN_MIN) return null
  const xs = pts.map((p) => (p.t - t0) / MIN_MS)
  const ys = pts.map((p) => p.level)
  const n = xs.length
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0
  let den = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    den += (xs[i] - mx) ** 2
  }
  return den === 0 ? null : num / den
}

// Minutos até `target` mantendo a taxa atual. É uma extrapolação linear
// simplificada, não uma previsão de inundação. Retorna null quando não faz sentido.
export function timeToLevel(level, rate, target) {
  if (level == null || rate == null || !Number.isFinite(rate)) return null
  if (level >= target) return 0
  if (rate < RULES.MIN_RISING_RATE) return null
  return (target - level) / rate
}

export function classifyRisk({ level, rate, ttcMin, attentionLevel, criticalLevel }) {
  if (level >= criticalLevel) return 'critical'
  if (level / criticalLevel >= RULES.HIGH_RATIO || (ttcMin != null && ttcMin <= RULES.HIGH_ETA_MIN)) return 'high'
  if (level >= attentionLevel || (ttcMin != null && ttcMin <= RULES.MODERATE_ETA_MIN)) return 'moderate'
  if (rate != null && rate >= RULES.ATTENTION_RATE) return 'attention'
  return 'normal'
}

// Faixa da cota apenas pelo valor medido (usada no histórico, sem tendência).
export function levelBand(level, node) {
  if (level >= node.criticalLevel) return 'critical'
  if (level >= node.attentionLevel) return 'attention'
  return 'below'
}

// Estado de conexão. Prioridade: offline > dados desatualizados > instável > online.
export function deviceConnection(node, now) {
  const interval = node.reportIntervalSec * 1000
  if (node.lastCommunication == null) return 'offline'
  if (now - node.lastCommunication > RULES.OFFLINE_AFTER_INTERVALS * interval) return 'offline'
  if (node.lastReadingAt == null || now - node.lastReadingAt > RULES.STALE_AFTER_INTERVALS * interval) return 'stale'
  if ((node.packetLossPct ?? 0) >= RULES.UNSTABLE_PACKET_LOSS) return 'unstable'
  return 'online'
}

export const hasFreshData = (connection) => connection === 'online' || connection === 'unstable'

// Junta configuração do nó + leituras + relógio em um "view model".
// Nó sem dado recente NÃO alimenta cota, taxa, ETA nem risco.
export function buildOverview(nodes, readingsByNode, now) {
  return nodes.map((node) => {
    const readings = readingsByNode[node.id] ?? []
    const last = readings.length ? readings[readings.length - 1] : null
    const connection = deviceConnection(node, now)
    const fresh = hasFreshData(connection) && last != null
    const rate = fresh ? estimateRate(readings, last.t) : null
    const level = fresh ? last.level : null
    const ttcMin = fresh ? timeToLevel(level, rate, node.criticalLevel) : null
    const risk = fresh
      ? classifyRisk({ level, rate, ttcMin, attentionLevel: node.attentionLevel, criticalLevel: node.criticalLevel })
      : null
    return {
      ...node,
      connection,
      level,
      rate,
      ttcMin,
      risk,
      lastKnownLevel: last?.level ?? null,
      lastCommunicationAge: node.lastCommunication == null ? null : now - node.lastCommunication,
      lastReadingAge: node.lastReadingAt == null ? null : now - node.lastReadingAt,
    }
  })
}

// Integridade = nós com leitura recente (online + instável) ÷ nós cadastrados.
export function networkIntegrity(overview) {
  const total = overview.length
  const providing = overview.filter((n) => hasFreshData(n.connection)).length
  return { providing, total, pct: total === 0 ? null : (providing / total) * 100 }
}

export function highestRisk(overview) {
  let best = null
  for (const n of overview) {
    if (n.risk == null) continue
    if (best == null || riskRank(n.risk) > riskRank(best)) best = n.risk
  }
  return best
}

const ORDER = ['normal', 'attention', 'moderate', 'high', 'critical']
export const riskRank = (risk) => ORDER.indexOf(risk)

// Ponto em foco no dashboard: maior risco; empate → menor tempo até a cota crítica.
export function pickFocusNode(overview) {
  const fresh = overview.filter((n) => n.risk != null)
  if (!fresh.length) return null
  return [...fresh].sort((a, b) => {
    const d = riskRank(b.risk) - riskRank(a.risk)
    if (d !== 0) return d
    return (a.ttcMin ?? Infinity) - (b.ttcMin ?? Infinity)
  })[0]
}

// Reduz a quantidade de pontos para o gráfico (mantém sempre a última leitura).
export function downsample(readings, maxPoints = 360) {
  if (readings.length <= maxPoints) return readings
  const step = Math.ceil(readings.length / maxPoints)
  const out = []
  for (let i = 0; i < readings.length; i += step) out.push(readings[i])
  const last = readings[readings.length - 1]
  if (out[out.length - 1] !== last) out.push(last)
  return out
}

export const PERIODS = {
  '1h': { label: 'Última hora', ms: 60 * MIN_MS },
  '6h': { label: '6 horas', ms: 6 * 60 * MIN_MS },
  '24h': { label: '24 horas', ms: 24 * 60 * MIN_MS },
}

// Consulta do histórico: janela atual, janela anterior (comparação) e estatísticas.
export function computeHistory({ readings, node, periodMs, now, onlyAboveAttention }) {
  const from = now - periodMs
  const inWindow = readings.filter((r) => r.t >= from && r.t <= now)
  const filtered = onlyAboveAttention ? inWindow.filter((r) => r.level >= node.attentionLevel) : inWindow
  const previous = readings.filter((r) => r.t >= from - periodMs && r.t < from)

  let max = null
  let min = null
  let sum = 0
  for (const r of filtered) {
    if (max == null || r.level > max.level) max = r
    if (min == null || r.level < min.level) min = r
    sum += r.level
  }
  const stats = filtered.length
    ? { count: filtered.length, max, min, avg: sum / filtered.length, amplitude: max.level - min.level }
    : null

  // Linhas da tabela (mais recentes primeiro) com variação em relação à leitura anterior.
  const rows = []
  for (let i = filtered.length - 1; i >= 0; i--) {
    const r = filtered[i]
    const prev = filtered[i - 1]
    rows.push({
      id: r.id,
      t: r.t,
      level: r.level,
      deltaCm: prev ? r.level - prev.level : null,
      pctOfCritical: (r.level / node.criticalLevel) * 100,
      band: levelBand(r.level, node),
    })
  }
  return { from, to: now, series: inWindow, previous, stats, rows }
}
