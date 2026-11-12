// Fonte de dados SIMULADA. Imita o que os nós ESP32 enviariam e guarda tudo em memória.
// É a única parte que muda quando a API real existir: monitoringService.js
// só conversa com as funções exportadas aqui.

import { SEED_NODES, SEED_PAST_ALERTS, SCHEMATIC_SLOTS } from '../data/mockTelemetry'

const MINUTE = 60_000
const HISTORY_MINUTES = 24 * 60
const OVERSHOOT_CM = 8          // a simulação para de subir um pouco acima da cota crítica
const MAX_CATCHUP_TICKS = 240

let state = null

// Gerador pseudoaleatório determinístico: o histórico é o mesmo a cada reinício.
function createRng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const round1 = (v) => Math.round(v * 10) / 10

function makeReading(sensorId, t, level) {
  return { id: `${sensorId}@${t}`, sensorId, level, unit: 'cm', t, timestamp: new Date(t).toISOString() }
}

// Cota "de fundo" em função de quantos minutos faltam para o último dado.
function modelLevel(sim, minutesBeforeEnd) {
  let level = sim.floor + sim.rise * Math.exp(-minutesBeforeEnd / sim.tau)
  level += 1.2 * Math.sin(minutesBeforeEnd / 70)
  if (sim.pastBump) {
    const { amp, centerMin, widthMin } = sim.pastBump
    level += amp * Math.exp(-(((minutesBeforeEnd - centerMin) / widthMin) ** 2))
  }
  return Math.max(0, level)
}

function buildHistory(node, now) {
  const { sim } = node
  const rng = createRng(hash(node.id))
  const lastSeen = sim.lastSeenMinAgo ?? 0
  const out = []
  for (let m = HISTORY_MINUTES; m >= lastSeen; m--) {
    if (sim.behavior === 'lossy' && m > 0 && rng() < 0.12) continue // lacunas de pacote
    const level = round1(modelLevel(sim, m - lastSeen) + (rng() - 0.5) * 0.4)
    out.push(makeReading(node.id, now - m * MINUTE, level))
  }
  return out
}

function registerNode(seed, now, { withHistory }) {
  const sim = seed.sim ?? { behavior: 'none' }
  const node = { ...seed, sim }
  const readings = withHistory ? buildHistory(node, now) : []
  const last = readings[readings.length - 1] ?? null
  let lastCommunication = null
  if (sim.behavior === 'rising' || sim.behavior === 'lossy' || sim.behavior === 'sensor_fault') lastCommunication = now
  if (sim.behavior === 'offline') lastCommunication = last?.t ?? null
  state.nodes.set(node.id, {
    ...node,
    lastCommunication,
    lastReadingAt: last?.t ?? null,
    lastTickAt: now,
  })
  state.readings.set(node.id, readings)
}

export function resetSimulation(now = Date.now()) {
  state = {
    startedAt: now,
    nodes: new Map(),
    readings: new Map(),
    rng: createRng(now & 0xffff),
    pastAlerts: SEED_PAST_ALERTS.map((a) => ({
      ...a,
      status: 'resolved',
      startedAt: now - a.startedMinAgo * MINUTE,
      resolvedAt: now - a.resolvedMinAgo * MINUTE,
      acknowledgedAt: null,
      recommendation: [],
    })),
  }
  SEED_NODES.forEach((seed) => registerNode(seed, now, { withHistory: true }))
}

function ensure() {
  if (!state) resetSimulation()
}

function emitTick(node, t) {
  const { sim } = node
  if (sim.behavior === 'lossy' && state.rng() < sim.dropProbability) return // pacote perdido
  node.lastCommunication = t
  if (sim.behavior === 'sensor_fault') return // o nó comunica, o sensor não mede
  const readings = state.readings.get(node.id)
  const prev = readings[readings.length - 1]
  const dtMin = (t - prev.t) / MINUTE
  const cap = node.criticalLevel + OVERSHOOT_CM
  const next = Math.min(cap, prev.level + sim.driftCmMin * dtMin + (state.rng() - 0.5) * 0.3)
  readings.push(makeReading(node.id, t, round1(next)))
  node.lastReadingAt = t
}

// Avança a simulação até `now`, gerando os envios que teriam ocorrido.
export function advance(now) {
  ensure()
  for (const node of state.nodes.values()) {
    const live = ['rising', 'lossy', 'sensor_fault'].includes(node.sim.behavior)
    if (!live) continue
    const interval = node.reportIntervalSec * 1000
    if (now - node.lastTickAt > MAX_CATCHUP_TICKS * interval) node.lastTickAt = now - interval
    while (node.lastTickAt + interval <= now) {
      node.lastTickAt += interval
      emitTick(node, node.lastTickAt)
    }
  }
}

const publicNode = ({ sim, lastTickAt, ...rest }) => {
  void sim
  void lastTickAt
  return rest
}

export function listNodes() {
  ensure()
  return [...state.nodes.values()].map(publicNode)
}

export function getReadings() {
  ensure()
  const out = {}
  for (const [id, list] of state.readings) out[id] = list.slice()
  return out
}

export function getPastAlerts() {
  ensure()
  return state.pastAlerts.slice()
}

export function createNode(input) {
  ensure()
  const slot = SCHEMATIC_SLOTS[(state.nodes.size - SEED_NODES.length) % SCHEMATIC_SLOTS.length] ?? { x: 50, y: 50 }
  registerNode(
    {
      ...input,
      schematic: slot,
      batteryPct: null,
      packetLossPct: null,
      localSignalling: true,
      sim: { behavior: 'none' }, // aguarda a primeira comunicação
    },
    Date.now(),
    { withHistory: false },
  )
  return publicNode(state.nodes.get(input.id))
}

export function updateNode(id, patch) {
  ensure()
  const node = state.nodes.get(id)
  if (!node) throw new Error('Nó não encontrado.')
  Object.assign(node, patch)
  return publicNode(node)
}

export function deleteNode(id) {
  ensure()
  if (!state.nodes.delete(id)) throw new Error('Nó não encontrado.')
  state.readings.delete(id)
}
