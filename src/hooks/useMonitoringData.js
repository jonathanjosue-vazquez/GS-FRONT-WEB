import { useEffect, useState, useCallback } from 'react'
import { getSnapshot } from '../services/monitoringService'

// Consulta a fonte de dados periodicamente e expõe snapshot / erro / carregamento.
// A interface só enxerga o serviço; trocar o simulador pela API não muda este hook.
export function useMonitoringData(intervalMs = 5000) {
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const next = await getSnapshot()
        if (!active) return
        setSnapshot(next)
        setError(null)
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Falha ao consultar os dados.')
      }
    }
    load()
    const id = setInterval(load, intervalMs)
    return () => {
      active = false
      clearInterval(id)
    }
  }, [intervalMs, reloadKey])

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])
  return { snapshot, error, loading: snapshot == null && error == null, refresh }
}
