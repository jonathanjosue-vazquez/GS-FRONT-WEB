import { useMemo } from 'react'
import { MonitoringContext } from './monitoringContext'
import { useMonitoringData } from '../hooks/useMonitoringData'
import { useToast } from '../hooks/useToast'
import * as service from '../services/monitoringService'

export default function MonitoringProvider({ children }) {
  const { snapshot, error, loading, refresh } = useMonitoringData(5000)
  const toast = useToast()

  // Cada ação chama o serviço, mostra o resultado e atualiza os dados.
  // Erros de validação sobem para o formulário (fieldErrors); os demais viram aviso.
  const actions = useMemo(() => {
    const run = async (fn, okMessage) => {
      try {
        const result = await fn()
        toast.success(okMessage)
        refresh()
        return { ok: true, result }
      } catch (e) {
        if (e.fieldErrors) return { ok: false, fieldErrors: e.fieldErrors }
        toast.error(e.message || 'Não foi possível concluir a ação.')
        return { ok: false }
      }
    }
    return {
      createNode: (input) => run(() => service.createNode(input), `Nó ${input.id} cadastrado. Aguardando a primeira comunicação.`),
      updateNode: (id, input) => run(() => service.updateNode(id, input), `Nó ${id} atualizado.`),
      deleteNode: (id) => run(() => service.deleteNode(id), `Nó ${id} removido.`),
      acknowledgeAlert: (id) => run(() => service.acknowledgeAlert(id), `Alerta ${id} reconhecido.`),
      resetSimulation: () => run(() => service.resetSimulation(), 'Simulação reiniciada.'),
    }
  }, [toast, refresh])

  const value = useMemo(() => ({ snapshot, error, loading, refresh, actions }), [snapshot, error, loading, refresh, actions])
  return <MonitoringContext.Provider value={value}>{children}</MonitoringContext.Provider>
}
