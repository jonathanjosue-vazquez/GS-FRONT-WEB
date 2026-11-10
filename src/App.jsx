import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Droplets, 
  Gauge, 
  HardDrive, 
  History, 
  LayoutDashboard, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  TrendingUp, 
  Wifi, 
  WifiOff 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados simulados para demonstração
const mockChartData = [
  { time: '12:00', level: 42 },
  { time: '13:00', level: 45 },
  { time: '14:00', level: 48 },
  { time: '15:00', level: 54 },
  { time: '16:00', level: 61 },
  { time: '17:00', level: 68 },
];

const mockAlerts = [
  {
    id: 1,
    location: 'Ponto 01 - Rio Anhembi',
    risk: 'Alto',
    speed: '+3.2 cm/min',
    time: 'Há 5 minutos',
    guidance: 'Evite a marginal do rio. Moradores de áreas baixas devem preparar itens essenciais.'
  },
  {
    id: 2,
    location: 'Ponto 02 - Córrego Central',
    risk: 'Médio',
    speed: '+1.8 cm/min',
    time: 'Há 18 minutos',
    guidance: 'Acompanhe as atualizações da Defesa Civil. Risco moderado de alagamento na via.'
  }
];

const mockSensors = [
  { id: 'ESP32-01', location: 'Rio Anhembi - Ponte 1', status: 'online', level: '68 cm', lastUpdate: 'Agora' },
  { id: 'ESP32-02', location: 'Córrego Central', status: 'online', level: '45 cm', lastUpdate: 'Há 2 min' },
  { id: 'ESP32-03', location: 'Canal Sul', status: 'offline', level: 'Desconectado', lastUpdate: 'Há 45 min' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide">PrevIA Hydro</h1>
              <p className="text-xs text-slate-400">Prevenção Preditiva</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'monitoring', label: 'Monitoramento', icon: MapPin },
              { id: 'history', label: 'Histórico', icon: History },
              { id: 'devices', label: 'Dispositivos', icon: HardDrive },
              { id: 'alerts', label: 'Central de Alertas', icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Modo Demonstração (GS 2026.2)
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="p-6 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white capitalize">{activeTab}</h2>
            <p className="text-xs text-slate-400">Visão geral do sistema de prevenção em tempo real</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> 2 Alertas Ativos
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'dashboard' ? (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium">Pontos Monitorados</span>
                    <MapPin className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-white">3</span>
                    <span className="text-xs text-slate-400">2 operacionais</span>
                  </div>
                </div>

                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium">Nível Atual (Crítico)</span>
                    <Droplets className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-amber-400">68 cm</span>
                    <span className="text-xs text-amber-400/80">Atenção</span>
                  </div>
                </div>

                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium">Velocidade de Elevação</span>
                    <TrendingUp className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-rose-400">+2.8 cm/min</span>
                    <span className="text-xs text-rose-400">Subindo rápido</span>
                  </div>
                </div>

                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium">Alertas Emitidos</span>
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-3xl font-bold text-white">2</span>
                    <span className="text-xs text-slate-400">Última hora</span>
                  </div>
                </div>
              </div>

              {/* Chart & Alerts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Evolution Chart */}
                <div className="lg:col-span-2 p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-cyan-400" /> Evolução do Nível da Água (cm)
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="time" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                        <Line type="monotone" dataKey="level" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Active Alerts */}
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-amber-400" /> Alertas Recentes
                    </h3>
                    <div className="space-y-3">
                      {mockAlerts.map((alert) => (
                        <div key={alert.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">{alert.location}</span>
                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-medium">
                              {alert.risk}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{alert.guidance}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Devices Status Table */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" /> Status dos Dispositivos Conectados
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900 text-slate-300 text-xs uppercase">
                      <tr>
                        <th className="p-3 rounded-l-lg">ID / Dispositivo</th>
                        <th className="p-3">Localização</th>
                        <th className="p-3">Nível</th>
                        <th className="p-3">Última Leitura</th>
                        <th className="p-3 rounded-r-lg text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {mockSensors.map((sensor) => (
                        <tr key={sensor.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-medium text-slate-200">{sensor.id}</td>
                          <td className="p-3">{sensor.location}</td>
                          <td className="p-3 text-slate-200 font-semibold">{sensor.level}</td>
                          <td className="p-3">{sensor.lastUpdate}</td>
                          <td className="p-3 text-right">
                            {sensor.status === 'online' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Wifi className="w-3 h-3" /> Online
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <WifiOff className="w-3 h-3" /> Offline
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-2xl">
              <h3 className="text-lg font-medium text-slate-300">Área em desenvolvimento</h3>
              <p className="text-sm text-slate-500 mt-1">A tela de {activeTab} será estruturada no próximo passo.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}