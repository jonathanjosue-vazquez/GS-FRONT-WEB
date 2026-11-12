import { useMemo, useState } from 'react'

// Filtros da central de alertas: status, categoria, severidade e ponto.
export function useAlertFilters(alerts) {
  const [status, setStatus] = useState('active')
  const [category, setCategory] = useState('all')
  const [severity, setSeverity] = useState('all')
  const [nodeId, setNodeId] = useState('all')

  const filtered = useMemo(() => {
    const pool = status === 'active' ? alerts.active : status === 'history' ? alerts.history : [...alerts.active, ...alerts.history]
    return pool
      .filter((a) => category === 'all' || a.category === category)
      .filter((a) => severity === 'all' || (a.category === 'risk' && (a.severity === severity || a.peakSeverity === severity)))
      .filter((a) => nodeId === 'all' || a.nodeId === nodeId)
      .sort((a, b) => (b.status === 'active') - (a.status === 'active') || b.startedAt - a.startedAt)
  }, [alerts, status, category, severity, nodeId])

  const hasFilters = category !== 'all' || severity !== 'all' || nodeId !== 'all'
  const clear = () => { setCategory('all'); setSeverity('all'); setNodeId('all') }

  return { status, setStatus, category, setCategory, severity, setSeverity, nodeId, setNodeId, filtered, hasFilters, clear }
}
