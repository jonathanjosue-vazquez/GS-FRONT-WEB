import { RiskBadge, ConnectionBadge } from '../ui/Badges'
import { formatAge, formatLevel } from '../../services/format'

const readingText = (n) =>
  n.lastReadingAge == null ? 'Nunca enviou' : `${formatLevel(n.lastKnownLevel)} cm · ${formatAge(n.lastReadingAge)}`

// Tabela em telas médias ou maiores; cartões no celular.
export default function DeviceList({ nodes, onSelect }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">Nós ESP32 cadastrados</caption>
          <thead>
            <tr className="border-b border-zinc-800/80 bg-zinc-950/40 text-[11px] text-zinc-500">
              <th scope="col" className="px-4 py-2.5 font-medium">Nó</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Ponto</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Conexão</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Última comunicação</th>
              <th scope="col" className="px-3 py-2.5 font-medium">Última leitura</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Nível</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Risco</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-xs">
            {nodes.map((n) => (
              <tr key={n.id} onClick={() => onSelect(n.id)} className="cursor-pointer hover:bg-zinc-900/70">
                <td className="px-4 py-2.5">
                  <button type="button" onClick={(e) => { e.stopPropagation(); onSelect(n.id) }} className="text-left font-mono text-zinc-200 underline-offset-2 hover:underline">
                    {n.id}
                  </button>
                </td>
                <td className="px-3 py-2.5 text-zinc-300">{n.code} · {n.name}<span className="block text-[11px] text-zinc-500">{n.location}</span></td>
                <td className="px-3 py-2.5"><ConnectionBadge state={n.connection} /></td>
                <td className="px-3 py-2.5 font-mono text-zinc-400">{formatAge(n.lastCommunicationAge)}</td>
                <td className="px-3 py-2.5 font-mono text-zinc-400">{readingText(n)}</td>
                <td className="px-3 py-2.5 text-right font-mono text-zinc-100">{n.level != null ? `${formatLevel(n.level)} cm` : '—'}</td>
                <td className="px-4 py-2.5"><RiskBadge risk={n.risk} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-2 md:hidden">
        {nodes.map((n) => (
          <li key={n.id}>
            <button type="button" onClick={() => onSelect(n.id)} className="w-full space-y-2 rounded-md border border-zinc-800 bg-zinc-950 p-3 text-left hover:border-zinc-600">
              <span className="flex items-start justify-between gap-2">
                <span>
                  <span className="block font-mono text-xs text-zinc-200">{n.id}</span>
                  <span className="block text-[11px] text-zinc-500">{n.code} · {n.name} — {n.location}</span>
                </span>
                <RiskBadge risk={n.risk} />
              </span>
              <span className="flex flex-wrap items-center justify-between gap-2">
                <ConnectionBadge state={n.connection} />
                <span className="font-mono text-xs text-zinc-300">{n.level != null ? `${formatLevel(n.level)} cm` : '—'}</span>
              </span>
              <span className="block font-mono text-[11px] text-zinc-500">Comunicou {formatAge(n.lastCommunicationAge)} · leitura: {readingText(n)}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
