import { MapPin } from 'lucide-react'
import { CONNECTION_LABELS } from '../../data/domain'
import { toneFor } from '../ui/tones'
import { formatLevel } from '../../services/format'

// Mapa ESQUEMÁTICO. As posições são fictícias (não são coordenadas geográficas reais).
export default function BasinMap({ nodes, selectedId, onSelect }) {
  return (
    <div className="relative h-80 w-full select-none overflow-hidden rounded-lg border border-slate-200 bg-[#f1f5f9] sm:h-96">
      {/* Camada Cartográfica Vetorial (Bairros, Vias, Áreas Verdes e Rio) */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {/* Quadras / Setores Urbanos */}
        <rect x="4" y="6" width="24" height="16" rx="1.5" fill="#e2e8f0" opacity="0.6" />
        <rect x="34" y="5" width="30" height="18" rx="1.5" fill="#e2e8f0" opacity="0.5" />
        <rect x="70" y="8" width="25" height="26" rx="1.5" fill="#e2e8f0" opacity="0.6" />
        <rect x="6" y="45" width="22" height="30" rx="1.5" fill="#e2e8f0" opacity="0.55" />
        <rect x="34" y="62" width="26" height="30" rx="1.5" fill="#e2e8f0" opacity="0.65" />
        <rect x="66" y="55" width="28" height="22" rx="1.5" fill="#e2e8f0" opacity="0.5" />

        {/* Área de Várzea / Parque Linear */}
        <path d="M 14,32 Q 36,48 56,58 L 48,68 Q 28,56 10,40 Z" fill="#dcfce7" opacity="0.7" />

        {/* Avenidas Marginais e Pontes */}
        <path d="M 3,12 Q 28,30 50,44 T 94,86" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
        <path d="M 9,20 Q 32,38 54,52 T 98,94" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
        <line x1="25" y1="15" x2="18" y2="42" stroke="#cbd5e1" strokeWidth="1.4" />
        <line x1="56" y1="32" x2="46" y2="62" stroke="#cbd5e1" strokeWidth="1.4" />

        {/* Leito do Rio / Canal Principal */}
        <path
          d="M 6,16 Q 30,34 52,48 T 96,90"
          fill="none"
          stroke="#bae6fd"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M 6,16 Q 30,34 52,48 T 96,90"
          fill="none"
          stroke="#0284c7"
          strokeOpacity="0.65"
          strokeWidth="1.1"
          strokeDasharray="2.5 2"
        />
      </svg>

      {/* Rótulos Geográficos Sutis */}
      <span className="pointer-events-none absolute left-4 top-3 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
        Margem Norte
      </span>
      <span className="pointer-events-none absolute right-5 top-4 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
        Setor Leste
      </span>
      <span className="pointer-events-none absolute bottom-10 left-6 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-400">
        Zona Residencial Sul
      </span>

      {/* Marcadores das Estações ESP32 */}
      {nodes.map((n) => {
        const tone = toneFor(n.risk)
        const selected = n.id === selectedId
        const degraded = n.connection !== 'online'
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => onSelect(n.id)}
            aria-pressed={selected}
            aria-label={`${n.code}, ${n.name}. ${n.level != null ? `${formatLevel(n.level)} centímetros` : 'sem leitura recente'}`}
            style={{ left: `${n.schematic.x}%`, top: `${n.schematic.y}%` }}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform ${
              selected ? 'z-20 scale-105' : 'z-10 hover:scale-105'
            }`}
          >
            <span
              style={{ borderColor: tone.hex, color: tone.hex }}
              className={`flex min-h-9 items-center gap-1.5 rounded-lg border-2 bg-white px-2.5 font-mono text-[11px] shadow-md ${
                selected ? 'ring-4 ring-sky-500/20' : ''
              } ${n.risk == null ? 'border-dashed opacity-85' : ''}`}
            >
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="font-bold">{n.code}</span>
              {n.level != null && <span className="font-semibold">{formatLevel(n.level)} cm</span>}
            </span>
            <span className="mt-1 hidden whitespace-nowrap rounded-md border border-slate-200 bg-white/95 px-2 py-0.5 text-[10px] font-medium text-slate-700 shadow-xs sm:block">
              {degraded ? CONNECTION_LABELS[n.connection] : n.zone}
            </span>
          </button>
        )
      })}

      {/* Rosa dos Ventos / Legenda Discreta */}
      <div className="absolute bottom-2.5 left-2.5 rounded-md border border-slate-200 bg-white/90 px-2.5 py-1 font-mono text-[10px] text-slate-500 backdrop-blur-xs">
        Mapa esquemático de demonstração · posições simuladas
      </div>
    </div>
  )
}