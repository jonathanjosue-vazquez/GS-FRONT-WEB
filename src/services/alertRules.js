// Gera as condições de alerta a partir do estado atual dos nós.
// Alerta de RISCO (nível da água) e alerta de DISPOSITIVO (conexão) são categorias
// separadas e nunca se misturam.

import { RISK_GUIDANCE, RISK_OPERATOR_ACTION } from '../data/domain'
import { formatLevel, formatRate, formatEta, formatAge, formatTime } from './format'


const RISK_TITLES = {
  attention: 'Nível em elevação',
  moderate: 'Risco moderado no ponto',
  high: 'Risco alto de transbordamento',
  critical: 'Cota crítica atingida',
}

function riskReason(n) {
  const pct = Math.round((n.level / n.criticalLevel) * 100)
  const parts = [`Cota de ${formatLevel(n.level)} cm (${pct}% da cota crítica de ${formatLevel(n.criticalLevel)} cm).`]
  if (n.rate != null) parts.push(`Elevação de ${formatRate(n.rate)} cm/min.`)
  if (n.ttcMin != null && n.ttcMin > 0) parts.push(`Projeção linear simplificada: ${formatEta(n.ttcMin)} até a cota crítica.`)
  return parts.join(' ')
}

export function deriveAlertConditions(overview) {
  const out = []
  for (const n of overview) {
    if (n.risk && n.risk !== 'normal') {
      out.push({
        key: `${n.id}:risk`,
        category: 'risk',
        nodeId: n.id,
        severity: n.risk,
        title: RISK_TITLES[n.risk],
        reason: riskReason(n),
        recommendation: RISK_GUIDANCE[n.risk],
        operatorAction: RISK_OPERATOR_ACTION[n.risk],
      })
    }
    if (n.connection === 'offline') {
      const since = n.lastCommunication == null
        ? 'O nó ainda não enviou nenhuma comunicação.'
        : `Sem comunicação desde ${formatTime(n.lastCommunication)} (${formatAge(n.lastCommunicationAge)}). Última cota registrada: ${formatLevel(n.lastKnownLevel)} cm, desatualizada.`
      out.push({
        key: `${n.id}:device`,
        category: 'device',
        nodeId: n.id,
        issue: 'offline',
        title: 'Nó sem comunicação',
        reason: since,
        recommendation: [
          'Este ponto está sem monitoramento remoto. Acompanhe os comunicados oficiais da Defesa Civil.',
        ],
        operatorAction: 'Verificar alimentação e módulo Wi-Fi. Sem comunicação não é possível confirmar o estado da sinalização local (LED/buzzer).',
      })
    } else if (n.connection === 'stale') {
      out.push({
        key: `${n.id}:device`,
        category: 'device',
        nodeId: n.id,
        issue: 'stale',
        title: 'Leituras desatualizadas',
        reason: `O nó comunica, mas o sensor não envia leitura válida ${formatAge(n.lastReadingAge)}. Última cota: ${formatLevel(n.lastKnownLevel)} cm.`,
        recommendation: [
          'A cota deste ponto não está sendo atualizada. Acompanhe os comunicados oficiais da Defesa Civil.',
        ],
        operatorAction: 'Inspecionar o sensor ultrassônico (obstrução, cabo ou alinhamento).',
      })
    }
  }
  return out
}
