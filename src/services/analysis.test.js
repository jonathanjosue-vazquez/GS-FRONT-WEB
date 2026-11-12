import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  estimateRate, timeToLevel, classifyRisk, deviceConnection, networkIntegrity,
  buildOverview, computeHistory, downsample, pickFocusNode,
} from './analysis.js'

const MIN = 60_000
const now = 1_000_000_000_000
const series = (levels, stepMin = 1) =>
  levels.map((level, i) => ({ id: `r${i}`, t: now - (levels.length - 1 - i) * stepMin * MIN, level }))

test('estimateRate acha a inclinação de uma subida linear', () => {
  const rs = series([50, 51, 52, 53, 54, 55])
  assert.ok(Math.abs(estimateRate(rs, now) - 1) < 1e-9)
})

test('estimateRate retorna null com poucos pontos ou janela curta', () => {
  assert.equal(estimateRate(series([50, 51]), now), null)
  assert.equal(estimateRate(series([50, 51, 52], 0.5), now), null)
  assert.equal(estimateRate([], now), null)
})

test('timeToLevel não projeta com taxa zero, negativa ou inválida', () => {
  assert.equal(timeToLevel(60, 0, 80), null)
  assert.equal(timeToLevel(60, -1, 80), null)
  assert.equal(timeToLevel(60, null, 80), null)
  assert.equal(timeToLevel(60, NaN, 80), null)
  assert.equal(timeToLevel(60, 0.01, 80), null)
  assert.equal(timeToLevel(85, 1, 80), 0)
  assert.equal(timeToLevel(60, 2, 80), 10)
})

test('classifyRisk cobre os cinco níveis', () => {
  const base = { attentionLevel: 50, criticalLevel: 80 }
  assert.equal(classifyRisk({ ...base, level: 30, rate: 0, ttcMin: null }), 'normal')
  assert.equal(classifyRisk({ ...base, level: 30, rate: 0.2, ttcMin: 250 }), 'attention')
  assert.equal(classifyRisk({ ...base, level: 52, rate: 0.1, ttcMin: null }), 'moderate')
  assert.equal(classifyRisk({ ...base, level: 40, rate: 1, ttcMin: 40 }), 'moderate')
  assert.equal(classifyRisk({ ...base, level: 68, rate: 0.5, ttcMin: 24 }), 'high')
  assert.equal(classifyRisk({ ...base, level: 40, rate: 3, ttcMin: 10 }), 'high')
  assert.equal(classifyRisk({ ...base, level: 80, rate: 0, ttcMin: 0 }), 'critical')
})

test('deviceConnection distingue online, instável, desatualizado e offline', () => {
  const n = { reportIntervalSec: 30, lastCommunication: now - 10_000, lastReadingAt: now - 10_000, packetLossPct: 2 }
  assert.equal(deviceConnection(n, now), 'online')
  assert.equal(deviceConnection({ ...n, packetLossPct: 35 }, now), 'unstable')
  assert.equal(deviceConnection({ ...n, lastReadingAt: now - 40 * MIN }, now), 'stale')
  assert.equal(deviceConnection({ ...n, lastCommunication: now - 47 * MIN, lastReadingAt: now - 47 * MIN }, now), 'offline')
  assert.equal(deviceConnection({ ...n, lastCommunication: null, lastReadingAt: null }, now), 'offline')
})

test('nó offline não alimenta cota, taxa, ETA nem risco', () => {
  const node = {
    id: 'N', reportIntervalSec: 30, attentionLevel: 50, criticalLevel: 80,
    lastCommunication: now - 47 * MIN, lastReadingAt: now - 47 * MIN, packetLossPct: null,
  }
  const [o] = buildOverview([node], { N: series([40, 41, 42, 43, 44]) }, now)
  assert.equal(o.connection, 'offline')
  assert.equal(o.level, null)
  assert.equal(o.rate, null)
  assert.equal(o.ttcMin, null)
  assert.equal(o.risk, null)
  assert.equal(o.lastKnownLevel, 44)
})

test('integridade conta apenas nós com leitura recente', () => {
  const r = networkIntegrity([
    { connection: 'online' }, { connection: 'unstable' }, { connection: 'offline' }, { connection: 'stale' },
  ])
  assert.deepEqual(r, { providing: 2, total: 4, pct: 50 })
  assert.equal(networkIntegrity([]).pct, null)
})

test('pickFocusNode escolhe maior risco e ignora nós sem dado', () => {
  const f = pickFocusNode([
    { id: 'a', risk: 'attention', ttcMin: 100 }, { id: 'b', risk: 'high', ttcMin: 12 },
    { id: 'c', risk: null, ttcMin: null },
  ])
  assert.equal(f.id, 'b')
  assert.equal(pickFocusNode([{ id: 'x', risk: null }]), null)
})

test('computeHistory aplica período, filtro e estatísticas', () => {
  const node = { attentionLevel: 50, criticalLevel: 80 }
  const rs = series([40, 55, 60, 45], 30) // 90, 60, 30, 0 min atrás
  const h = computeHistory({ readings: rs, node, periodMs: 45 * MIN, now, onlyAboveAttention: false })
  assert.equal(h.series.length, 2)
  assert.equal(h.stats.max.level, 60)
  assert.equal(h.stats.min.level, 45)
  const f = computeHistory({ readings: rs, node, periodMs: 120 * MIN, now, onlyAboveAttention: true })
  assert.equal(f.rows.length, 2)
  assert.equal(f.stats.min.level, 55)
  assert.equal(f.rows[0].t > f.rows[1].t, true)
  const empty = computeHistory({ readings: [], node, periodMs: MIN, now, onlyAboveAttention: false })
  assert.equal(empty.stats, null)
})

test('downsample respeita o limite e mantém a última leitura', () => {
  const rs = series(Array.from({ length: 1000 }, (_, i) => i))
  const d = downsample(rs, 100)
  assert.ok(d.length <= 101)
  assert.equal(d[d.length - 1], rs[rs.length - 1])
})
