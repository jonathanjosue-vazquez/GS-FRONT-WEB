// Camada de serviço consumida pela interface. Hoje usa o repositório simulado;
// ao integrar a API da equipe, troque as chamadas ao `repo` por requisições HTTP
// mantendo o formato das respostas abaixo. A interface não precisa mudar.

import * as repo from './mockRepository'
import { buildOverview, networkIntegrity, highestRisk, riskRank } from './analysis'
import { deriveAlertConditions } from './alertRules'
import { validateNodeInput, normalizeNodeInput } from './validation'

const FIRST_ALERT_NUMBER = 92

let episodes = new Map() // key -> episódio de alerta ativo
let closedEpisodes = []  // episódios encerrados nesta sessão
let nextAlertNumber = FIRST_ALERT_NUMBER

const alertId = (n) => `ALT-${String(n).padStart(3, '0')}`

function trackAlerts(overview, now) {
  const conditions = deriveAlertConditions(overview)
  const seen = new Set()
  for (const c of conditions) {
    seen.add(c.key)
    const prev = episodes.get(c.key)
    if (!prev) {
      episodes.set(c.key, { id: alertId(nextAlertNumber++), startedAt: now, acknowledgedAt: null, peak: c.severity ?? null, last: c })
    } else {
      prev.last = c
      if (c.severity && (prev.peak == null || riskRank(c.severity) > riskRank(prev.peak))) prev.peak = c.severity
    }
  }
  for (const [key, ep] of episodes) {
    if (!seen.has(key)) {
      closedEpisodes.unshift({ ...toAlert(ep), status: 'resolved', resolvedAt: now })
      episodes.delete(key)
    }
  }
  const active = [...episodes.values()].map((ep) => toAlert(ep))
  active.sort((a, b) => (riskRank(b.severity ?? 'normal') - riskRank(a.severity ?? 'normal')) || a.startedAt - b.startedAt)
  const history = [...closedEpisodes, ...repo.getPastAlerts()].sort((a, b) => b.resolvedAt - a.resolvedAt)
  return { active, history }
}

function toAlert(ep) {
  return {
    ...ep.last,
    id: ep.id,
    startedAt: ep.startedAt,
    acknowledgedAt: ep.acknowledgedAt,
    peakSeverity: ep.peak,
    status: 'active',
    resolvedAt: null,
  }
}

export async function getSnapshot() {
  const now = Date.now()
  repo.advance(now)
  const readings = repo.getReadings()
  const nodes = buildOverview(repo.listNodes(), readings, now)
  return {
    now,
    nodes,
    readings,
    integrity: networkIntegrity(nodes),
    overallRisk: highestRisk(nodes),
    alerts: trackAlerts(nodes, now),
  }
}

export async function createNode(input) {
  const errors = validateNodeInput(input, repo.listNodes())
  if (Object.keys(errors).length) throw Object.assign(new Error('Dados inválidos.'), { fieldErrors: errors })
  return repo.createNode(normalizeNodeInput(input))
}

export async function updateNode(id, input) {
  const errors = validateNodeInput(input, repo.listNodes(), { editingId: id })
  if (Object.keys(errors).length) throw Object.assign(new Error('Dados inválidos.'), { fieldErrors: errors })
  const { name, location, zone, attentionLevel, criticalLevel, reportIntervalSec } = normalizeNodeInput(input)
  return repo.updateNode(id, { name, location, zone, attentionLevel, criticalLevel, reportIntervalSec })
}

export async function deleteNode(id) {
  repo.deleteNode(id)
  for (const key of [...episodes.keys()]) if (key.startsWith(`${id}:`)) episodes.delete(key)
}

export async function acknowledgeAlert(id) {
  const ep = [...episodes.values()].find((e) => e.id === id)
  if (!ep) throw new Error('Este alerta já foi encerrado.')
  ep.acknowledgedAt = Date.now()
}

export async function resetSimulation() {
  repo.resetSimulation()
  episodes = new Map()
  closedEpisodes = []
  nextAlertNumber = FIRST_ALERT_NUMBER
}
