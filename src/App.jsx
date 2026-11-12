import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Cpu,
  Droplets,
  History,
  LayoutGrid,
  MapPin,
  Radio,
  ShieldAlert,
  Sliders,
  Terminal,
  Wifi,
  WifiOff,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// Dados simulados de telemetria (Claramente identificados como demonstração)
const telemetryData = [
  { time: '12:00', level: 42, rate: 0.4 },
  { time: '12:30', level: 44, rate: 0.5 },
  { time: '13:00', level: 45, rate: 0.6 },
  { time: '13:30', level: 48, rate: 1.1 },
  { time: '14:00', level: 51, rate: 1.4 },
  { time: '14:30', level: 55, rate: 1.9 },
  { time: '15:00', level: 59, rate: 2.2 },
  { time: '15:30', level: 63, rate: 2.5 },
  { time: '16:00', level: 68, rate: 2.8 },
];

const alertsFeed = [
  {
    id: 'ALT-094',
    station: 'EST-01 // Rio Anhembi (Ponte Norte)',
    severity: 'ALTO',
    rate: '+2.8 cm/min',
    timestamp: '16:00:12',
    action: 'Bloquear acesso à via marginal. Notificar Defesa Civil local e moradores da Zona A.'
  },
  {
    id: 'ALT-093',
    station: 'EST-02 // Córrego Central',
    severity: 'MODERADO',
    rate: '+1.4 cm/min',
    timestamp: '15:42:05',
    action: 'Monitoramento intensivo ativado. Manter equipe de prevenção em sobreaviso.'
  }
];

const nodesList = [
  { id: 'ESP32-NODE-01', name: 'Rio Anhembi - Ponte Norte', level: 68, limit: 80, rate: '+2.8', status: 'online', ping: '24ms', lastSync: 'há 4s' },
  { id: 'ESP32-NODE-02', name: 'Córrego Central - Galeria', level: 45, limit: 75, rate: '+1.4', status: 'online', ping: '31ms', lastSync: 'há 12s' },
  { id: 'ESP32-NODE-03', name: 'Canal Sul - Comporta 02', level: null, limit: 90, rate: '0.0', status: 'offline', ping: '--', lastSync: 'há 45m' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedNode, setSelectedNode] = useState('ESP32-NODE-01');

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutGrid },
    { id: 'monitoring', label: 'Mapa & Pontos', icon: MapPin },
    { id: 'history', label: 'Séries Históricas', icon: History },
    { id: 'devices', label: 'Nós ESP32', icon: Cpu },
    { id: 'alerts', label: 'Protocolos & Alertas', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sidebar Técnica */}
      <aside className="w-60 bg-zinc-950 border-r border-zinc-800/80 flex flex-col justify-between">
        <div>
          {/* Identidade do Sistema */}
          <div className="h-14 px-4 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="font-semibold tracking-tight text-sm text-zinc-100">
                PrevIA <span className="text-emerald-400 font-mono">HYDRO</span>
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              v0.2
            </span>
          </div>

          {/* Menu */}
          <div className="p-3">
            <div className="px-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Operação
            </div>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                      active
                        ? 'bg-zinc-900 text-emerald-400 border border-zinc-800'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-zinc-500'}`} />
                      {item.label}
                    </span>
                    {item.id === 'alerts' && (
                      <span className="px-1.5 py-0.2 text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                        2
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Rodapé Técnico / Status da Simulação */}
        <div className="p-3 border-t border-zinc-800/80 space-y-2">
          <div className="p-2.5 rounded-md bg-zinc-900/80 border border-zinc-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Telemetria Simulada
              </span>
              <span className="font-mono text-[10px] text-zinc-500">GS-26.2</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              Ambiente de demonstração. Dados não representam alertas oficiais da Defesa Civil.
            </p>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar de Controle */}
        <header className="h-14 px-6 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-medium text-zinc-200">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
            <span className="text-zinc-700">/</span>
            <span className="text-xs font-mono text-zinc-400">
              Bacia Urbana — Setor Leste
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>2/3 Nós Online</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>RISCO ELEVADO</span>
            </div>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' ? (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Faixa de KPIs Compacta e Técnica */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/90">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Cota Atual (EST-01)</span>
                    <Droplets className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-semibold text-zinc-100">68.0</span>
                    <span className="text-xs font-mono text-zinc-500">cm / 80cm</span>
                  </div>
                  <div className="mt-2 w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full w-[85%]" />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/90">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Taxa de Elevação</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-semibold text-rose-400">+2.8</span>
                    <span className="text-xs font-mono text-zinc-400">cm/min</span>
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-500">
                    Tendência acelerada nos últimos 30m
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/90">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Tempo Est. p/ Cota Crítica</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-semibold text-amber-400">~4.3</span>
                    <span className="text-xs font-mono text-zinc-400">minutos</span>
                  </div>
                  <p className="mt-2 text-[11px] text-zinc-500">
                    Baseado na velocidade linear atual
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/90">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Integridade da Rede</span>
                    <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-semibold text-emerald-400">66.7%</span>
                    <span className="text-xs font-mono text-zinc-500">(1 falha)</span>
                  </div>
                  <p className="mt-2 text-[11px] text-rose-400/90">
                    ESP32-NODE-03 sem resposta
                  </p>
                </div>
              </div>

              {/* Bloco Principal Assimétrico: Gráfico (8 colunas) + Alertas Operacionais (4 colunas) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Gráfico de Telemetria */}
                <div className="lg:col-span-8 p-5 rounded-lg bg-zinc-900/60 border border-zinc-800/90 flex flex-col justify-between">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h2 className="text-sm font-medium text-zinc-100">
                        Curva de Elevação do Nível (cm)
                      </h2>
                      <p className="text-xs text-zinc-500">
                        Leitura contínua do sensor ultrassônico • Limite de transbordamento em 80 cm
                      </p>
                    </div>
                    <select
                      value={selectedNode}
                      onChange={(e) => setSelectedNode(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ESP32-NODE-01">ESP32-NODE-01 (Rio Anhembi)</option>
                      <option value="ESP32-NODE-02">ESP32-NODE-02 (Córrego Central)</option>
                    </select>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                          dataKey="time"
                          stroke="#71717a"
                          tick={{ fontSize: 11, fontFamily: 'monospace' }}
                          axisLine={{ stroke: '#27272a' }}
                        />
                        <YAxis
                          domain={[0, 90]}
                          stroke="#71717a"
                          tick={{ fontSize: 11, fontFamily: 'monospace' }}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#09090b',
                            borderColor: '#27272a',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontFamily: 'monospace'
                          }}
                        />
                        <ReferenceLine
                          y={80}
                          stroke="#f43f5e"
                          strokeDasharray="4 4"
                          label={{ value: 'COTA CRÍTICA (80cm)', position: 'insideTopLeft', fill: '#f43f5e', fontSize: 10, fontFamily: 'monospace' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="level"
                          name="Nível (cm)"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#waterGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Painel Lateral de Protocolos & Alertas */}
                <div className="lg:col-span-4 p-5 rounded-lg bg-zinc-900/60 border border-zinc-800/90 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-medium text-zinc-100 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      Ocorrências e Orientações
                    </h2>
                    <span className="text-[11px] font-mono text-zinc-500">TEMPO REAL</span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {alertsFeed.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3.5 rounded-md bg-zinc-950 border border-zinc-800/90 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-zinc-500">
                            {alert.id} • {alert.timestamp}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                              alert.severity === 'ALTO'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {alert.severity} ({alert.rate})
                          </span>
                        </div>
                        <div className="text-xs font-medium text-zinc-200">
                          {alert.station}
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/80 pt-2">
                          {alert.action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tabela Técnica de Hardware / Nós ESP32 */}
              <div className="rounded-lg bg-zinc-900/60 border border-zinc-800/90 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-zinc-800/80 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-zinc-100">
                    Telemetria dos Nós de Borda (ESP32)
                  </h2>
                  <span className="text-xs font-mono text-zinc-500">
                    Modo Offline Local: Ativo (LED/Buzzer)
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800/80 text-[11px] font-mono uppercase text-zinc-500 bg-zinc-950/40">
                        <th className="py-2.5 px-5 font-medium">ID do Nó</th>
                        <th className="py-2.5 px-5 font-medium">Ponto Geográfico</th>
                        <th className="py-2.5 px-5 font-medium">Leitura</th>
                        <th className="py-2.5 px-5 font-medium">Variação</th>
                        <th className="py-2.5 px-5 font-medium">Sincronização</th>
                        <th className="py-2.5 px-5 font-medium text-right">Conexão</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-xs">
                      {nodesList.map((node) => (
                        <tr key={node.id} className="hover:bg-zinc-900/80 transition-colors">
                          <td className="py-3 px-5 font-mono text-zinc-300">{node.id}</td>
                          <td className="py-3 px-5 text-zinc-200">{node.name}</td>
                          <td className="py-3 px-5 font-mono">
                            {node.level !== null ? (
                              <span className="text-zinc-100 font-medium">{node.level} cm</span>
                            ) : (
                              <span className="text-zinc-600">--</span>
                            )}
                          </td>
                          <td className="py-3 px-5 font-mono text-zinc-400">{node.rate} cm/m</td>
                          <td className="py-3 px-5 font-mono text-zinc-500">{node.lastSync}</td>
                          <td className="py-3 px-5 text-right">
                            {node.status === 'online' ? (
                              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                                <Wifi className="w-3.5 h-3.5" /> ONLINE ({node.ping})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-rose-400">
                                <WifiOff className="w-3.5 h-3.5" /> FALHA DE SINAL
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto p-8 rounded-lg bg-zinc-900/40 border border-dashed border-zinc-800 text-center">
              <p className="text-sm font-mono text-zinc-400">
                Módulo [{activeTab.toUpperCase()}] pronto para implementação.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}