import { useMemo, useState } from 'react'
import { PERIODS, computeHistory } from '../services/analysis'

// Estado e consulta da tela de séries históricas.
export function useHistory({ nodes, readings, now, initialNodeId }) {
  const [requestedNodeId, setNodeId] = useState(initialNodeId)
  const [periodKey, setPeriodKey] = useState('6h')
  const [onlyAboveAttention, setOnlyAbove] = useState(false)
  const [compare, setCompare] = useState(false)

  // Se o nó escolhido foi removido, volta para o primeiro disponível.
  const node = nodes.find((n) => n.id === requestedNodeId) ?? nodes[0] ?? null
  const periodMs = PERIODS[periodKey].ms

  const result = useMemo(() => {
    if (!node) return null
    return computeHistory({ readings: readings[node.id] ?? [], node, periodMs, now, onlyAboveAttention })
  }, [node, readings, periodMs, now, onlyAboveAttention])

  return {
    node, nodeId: node?.id ?? null, setNodeId,
    periodKey, setPeriodKey, periodMs,
    onlyAboveAttention, setOnlyAbove,
    compare, setCompare,
    result,
  }
}
