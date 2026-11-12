import { useState } from 'react'
import { Button } from '../ui/Controls'
import { formatDateTime, formatLevel } from '../../services/format'

const PAGE = 25
const BAND = {
  below: { label: 'Abaixo da atenção', cls: 'text-zinc-400' },
  attention: { label: 'Acima da atenção', cls: 'text-amber-400' },
  critical: { label: 'Acima da crítica', cls: 'text-rose-400' },
}

export default function HistoryTable({ rows }) {
  const [visible, setVisible] = useState(PAGE)
  const shown = rows.slice(0, visible)
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <caption className="sr-only">Leituras do período, da mais recente para a mais antiga</caption>
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-950/40 text-[11px] text-zinc-500">
              <th scope="col" className="px-3 py-2.5 font-medium">Horário</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Nível (cm)</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Variação (cm)</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">% da cota crítica</th>
              <th scope="col" className="px-3 py-2.5 font-medium" title="Faixa pelo valor medido, sem considerar a tendência">Faixa da cota</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
            {shown.map((r) => (
              <tr key={r.id}>
                <td className="px-3 py-2 text-zinc-300">{formatDateTime(r.t)}</td>
                <td className="px-3 py-2 text-right text-zinc-100">{formatLevel(r.level)}</td>
                <td className="px-3 py-2 text-right text-zinc-400">
                  {r.deltaCm == null ? '—' : `${r.deltaCm > 0 ? '+' : ''}${formatLevel(r.deltaCm)}`}
                </td>
                <td className="px-3 py-2 text-right text-zinc-400">{Math.round(r.pctOfCritical)}%</td>
                <td className={`px-3 py-2 font-sans ${BAND[r.band].cls}`}>{BAND[r.band].label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
        <span className="text-[11px] text-zinc-500">Exibindo {shown.length} de {rows.length} leituras</span>
        {visible < rows.length && <Button onClick={() => setVisible((v) => v + 50)}>Mostrar mais 50</Button>}
      </div>
    </div>
  )
}
