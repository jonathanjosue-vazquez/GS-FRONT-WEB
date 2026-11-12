import { LayoutGrid, MapPin, History, Cpu, ShieldAlert } from 'lucide-react'

export const NAV_ITEMS = [
  { to: '/', label: 'Visão Geral', icon: LayoutGrid, end: true },
  { to: '/mapa', label: 'Mapa & Pontos', icon: MapPin },
  { to: '/historico', label: 'Séries Históricas', icon: History },
  { to: '/nos', label: 'Nós ESP32', icon: Cpu },
  { to: '/alertas', label: 'Protocolos & Alertas', icon: ShieldAlert },
]
