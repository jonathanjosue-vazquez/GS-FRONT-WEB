import React, { useState } from 'react';
import { MapPin, Radio, WifiOff, AlertTriangle, CheckCircle2, ArrowUpRight, Shield } from 'lucide-react';
import { nodesData } from '../data/mockTelemetry';

export default function Monitoring() {
  const [selectedNodeId, setSelectedNodeId] = useState(nodesData[0].id);
  const selectedNode = nodesData.find((n) => n.id === selectedNodeId) || nodesData[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Mapa Esquemático da Bacia Urbana (8 colunas) */}
        <div className="lg:col-span-8 rounded-lg bg-zinc-900/60 border border-zinc-800/90 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-medium text-zinc-100">
                Topologia Geográfica — Bacia Urbana Setor Leste
              </h2>
              <p className="text-xs text-zinc-500">
                Selecione uma estação no mapa para inspecionar telemetria e cotas locais
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Normal
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Alerta
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Offline
              </span>
            </div>
          </div>

          {/* Área Visual do Radar / Mapa */}
          <div className="relative h-96 w-full rounded-md bg-zinc-950 border border-zinc-800 overflow-hidden select-none">
            {/* Grade Técnica de Fundo */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />

            {/* Traçado Esquemático do Curso d'Água (SVG) */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 10,20 Q 32,38 55,50 T 92,85"
                fill="none"
                stroke="#0ea5e9"
                strokeOpacity="0.22"
                strokeWidth="3.5"
              />
              <path
                d="M 10,20 Q 32,38 55,50 T 92,85"
                fill="none"
                stroke="#38bdf8"
                strokeOpacity="0.45"
                strokeWidth="0.6"
                strokeDasharray="2 2"
              />
            </svg>

            {/* Marcadores das Estações */}
            {nodesData.map((node) => {
              const isSelected = node.id === selectedNode.id;
              const isOffline = node.status === 'offline';
              const isWarning = node.level !== null && node.level >= node.warningLimit;

              const colorClasses = isOffline
                ? 'border-rose-500 bg-rose-500/20 text-rose-400'
                : isWarning
                ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                : 'border-emerald-400 bg-emerald-400/20 text-emerald-300';

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center transition-transform ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`px-2.5 py-1 rounded border backdrop-blur-sm flex items-center gap-1.5 font-mono text-[11px] shadow-lg ${colorClasses} ${
                      isSelected ? 'ring-2 ring-white/40' : ''
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-semibold">{node.code}</span>
                    {node.level !== null && <span>({node.level}cm)</span>}
                  </div>
                  <span className="mt-1 px-1.5 py-0.5 rounded bg-zinc-950/90 border border-zinc-800 text-[10px] text-zinc-300 whitespace-nowrap">
                    {node.zone}
                  </span>
                </button>
              );
            })}

            {/* Legenda de Coordenadas Simuladas */}
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-zinc-900/90 border border-zinc-800 text-[10px] font-mono text-zinc-500">
              MAPA ESQUEMÁTICO DE DEMONSTRAÇÃO • ESCALA LOCAL
            </div>
          </div>
        </div>

        {/* Painel de Inspeção da Estação Selecionada (4 colunas) */}
        <div className="lg:col-span-4 rounded-lg bg-zinc-900/60 border border-zinc-800/90 p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-emerald-400">{selectedNode.id}</span>
                <h3 className="text-base font-medium text-zinc-100">{selectedNode.name}</h3>
              </div>
              {selectedNode.status === 'online' ? (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  OFFLINE
                </span>
              )}
            </div>

            {/* Métricas do Ponto */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-[11px] text-zinc-500 block">Nível Atual</span>
                <span className="text-xl font-mono font-semibold text-zinc-100">
                  {selectedNode.level !== null ? `${selectedNode.level} cm` : '--'}
                </span>
              </div>
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-[11px] text-zinc-500 block">Velocidade</span>
                <span className="text-xl font-mono font-semibold text-amber-400">
                  {selectedNode.status === 'online' ? `+${selectedNode.rate} cm/m` : '--'}
                </span>
              </div>
            </div>

            {/* Parâmetros de Segurança */}
            <div className="p-3.5 rounded bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Setor / Região:</span>
                <span className="text-zinc-200">{selectedNode.zone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Cota de Atenção:</span>
                <span className="font-mono text-amber-400">{selectedNode.warningLimit} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Cota Crítica:</span>
                <span className="font-mono text-rose-400">{selectedNode.criticalLimit} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Última Sincronização:</span>
                <span className="font-mono text-zinc-300">{selectedNode.lastSync}</span>
              </div>
            </div>
          </div>

          {/* Diferencial Edge / Offline */}
          <div className="p-3.5 rounded bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-emerald-400 font-medium block mb-0.5">
                Contingência Local Ativa
              </strong>
              Mesmo sem conexão Wi-Fi/internet, este ESP32 aciona alertas sonoros (buzzer) e visuais (LED) localmente ao detectar subida rápida.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}