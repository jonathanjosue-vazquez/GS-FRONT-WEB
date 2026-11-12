// Exporta linhas do histórico em CSV (download real pelo navegador).
export function buildCsv(node, rows) {
  const header = 'timestamp,no,ponto,nivel_cm,variacao_cm,percentual_cota_critica'
  const lines = rows.map((r) =>
    [
      new Date(r.t).toISOString(), node.id, node.code, r.level.toFixed(1),
      r.deltaCm == null ? '' : r.deltaCm.toFixed(1), r.pctOfCritical.toFixed(1),
    ].join(','),
  )
  return [header, ...lines].join('\n')
}

export function downloadCsv(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
