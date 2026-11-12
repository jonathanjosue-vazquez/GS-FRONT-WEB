export const REPORT_INTERVALS = [15, 30, 60, 300]

// Valida o formulário de nó. Retorna { campo: mensagem } (vazio = válido).
export function validateNodeInput(input, existingNodes, { editingId = null } = {}) {
  const errors = {}
  const text = (v) => String(v ?? '').trim()

  if (!editingId) {
    if (!/^[A-Za-z0-9-]{3,32}$/.test(text(input.id))) errors.id = 'Use 3 a 32 caracteres: letras, números e hífen.'
    else if (existingNodes.some((n) => n.id.toLowerCase() === text(input.id).toLowerCase())) errors.id = 'Já existe um nó com este ID.'
    if (!/^[A-Za-z0-9-]{3,16}$/.test(text(input.code))) errors.code = 'Use 3 a 16 caracteres: letras, números e hífen.'
    else if (existingNodes.some((n) => n.code.toLowerCase() === text(input.code).toLowerCase())) errors.code = 'Já existe um ponto com este código.'
  }
  if (text(input.name).length < 3) errors.name = 'Informe o nome do curso d’água (mín. 3 letras).'
  if (text(input.location).length < 3) errors.location = 'Informe o local do sensor (mín. 3 letras).'
  if (text(input.zone).length < 3) errors.zone = 'Informe a zona ou região.'

  const attention = Number(input.attentionLevel)
  const critical = Number(input.criticalLevel)
  if (!Number.isFinite(attention) || attention <= 0) errors.attentionLevel = 'Informe um valor em cm maior que zero.'
  if (!Number.isFinite(critical) || critical <= 0) errors.criticalLevel = 'Informe um valor em cm maior que zero.'
  else if (Number.isFinite(attention) && attention >= critical) errors.criticalLevel = 'A cota crítica deve ser maior que a cota de atenção.'

  if (!REPORT_INTERVALS.includes(Number(input.reportIntervalSec))) errors.reportIntervalSec = 'Escolha um intervalo da lista.'
  return errors
}

export function normalizeNodeInput(input) {
  const t = (v) => String(v ?? '').trim()
  return {
    id: t(input.id),
    code: t(input.code).toUpperCase(),
    name: t(input.name),
    location: t(input.location),
    zone: t(input.zone),
    attentionLevel: Number(input.attentionLevel),
    criticalLevel: Number(input.criticalLevel),
    reportIntervalSec: Number(input.reportIntervalSec),
  }
}
