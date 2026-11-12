// Classes completas (o Tailwind só gera classes escritas por extenso).
// Cor só aparece quando carrega significado: verde/ciano = normal, amarelo/laranja = atenção,
// vermelho = crítico, cinza = sem dado ou neutro.

export const RISK_TONE = {
  normal: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400', text: 'text-emerald-400', bar: 'bg-emerald-400', hex: '#34d399' },
  attention: { badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30', dot: 'bg-cyan-400', text: 'text-cyan-300', bar: 'bg-cyan-400', hex: '#22d3ee' },
  moderate: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dot: 'bg-amber-400', text: 'text-amber-400', bar: 'bg-amber-400', hex: '#fbbf24' },
  high: { badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30', dot: 'bg-orange-400', text: 'text-orange-400', bar: 'bg-orange-400', hex: '#fb923c' },
  critical: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/40', dot: 'bg-rose-400', text: 'text-rose-400', bar: 'bg-rose-400', hex: '#fb7185' },
  none: { badge: 'bg-zinc-800/60 text-zinc-400 border-zinc-700', dot: 'bg-zinc-500', text: 'text-zinc-400', bar: 'bg-zinc-600', hex: '#71717a' },
}

export const toneFor = (risk) => RISK_TONE[risk] ?? RISK_TONE.none

export const CONNECTION_TONE = {
  online: { text: 'text-emerald-400', dot: 'bg-emerald-400' },
  unstable: { text: 'text-amber-400', dot: 'bg-amber-400' },
  stale: { text: 'text-zinc-300', dot: 'bg-zinc-500' },
  offline: { text: 'text-zinc-500', dot: 'bg-zinc-600' },
}
