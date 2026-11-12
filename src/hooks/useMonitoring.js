import { useContext } from 'react'
import { MonitoringContext } from '../context/monitoringContext'

export function useMonitoring() {
  const ctx = useContext(MonitoringContext)
  if (!ctx) throw new Error('useMonitoring deve ser usado dentro de <MonitoringProvider>.')
  return ctx
}
