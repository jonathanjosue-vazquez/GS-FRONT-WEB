const nf1 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const nf2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })
const timeSecFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
})

export const formatLevel = (v) => (v == null ? '—' : nf1.format(v))
export const formatRate = (v) => (v == null ? '—' : `${v > 0 ? '+' : ''}${nf2.format(v)}`)
export const formatTime = (t) => (t == null ? '—' : timeFmt.format(t))
export const formatTimeSec = (t) => (t == null ? '—' : timeSecFmt.format(t))
export const formatDateTime = (t) => (t == null ? '—' : dateTimeFmt.format(t))

// "há 12 s", "há 4 min", "há 2 h 10 min"
export function formatAge(ms) {
  if (ms == null) return '—'
  const s = Math.max(0, Math.round(ms / 1000))
  if (s < 60) return `há ${s} s`
  const m = Math.round(s / 60)
  if (m < 60) return `há ${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `há ${h} h ${rest} min` : `há ${h} h`
}

export function formatDuration(ms) {
  const m = Math.max(0, Math.round(ms / 60000))
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h} h ${rest} min` : `${h} h`
}

// Minutos até a cota crítica, com teto para não sugerir precisão que não existe.
export function formatEta(min) {
  if (min == null) return '—'
  if (min <= 0) return 'agora'
  if (min > 180) return '> 3 h'
  if (min >= 60) return `~${formatDuration(min * 60000)}`
  return `~${Math.max(1, Math.round(min))} min`
}
