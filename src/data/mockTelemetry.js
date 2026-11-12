// Configuração da telemetria SIMULADA (Global Solution 2026.2).
// Nada aqui é leitura real: os comportamentos em `sim` alimentam o simulador
// (services/mockRepository.js) que imita o que os nós ESP32 enviariam.
// Quando a API da equipe existir, este arquivo deixa de ser usado.
//
// Contrato interno de um nó (ajustar ao contrato real da equipe):
//   id, code, name, location, zone, schematic{x,y}, attentionLevel,
//   criticalLevel, reportIntervalSec, batteryPct, packetLossPct, localSignalling

export const SEED_NODES = [
  {
    id: 'ESP32-NODE-01',
    code: 'EST-01',
    name: 'Rio Tamanduateí',
    location: 'Av. do Estado · Vila Prudente',
    zone: 'Zona Sudeste — Bacia Tamanduateí',
    schematic: { x: 24, y: 30 },
    attentionLevel: 50,
    criticalLevel: 80,
    reportIntervalSec: 30,
    batteryPct: 94,
    packetLossPct: 2,
    localSignalling: true,
    sim: {
      behavior: 'rising',
      floor: 30, rise: 38, tau: 40, driftCmMin: 0.95,
      pastBump: { amp: 22, centerMin: 600, widthMin: 50 },
    },
  },
  {
    id: 'ESP32-NODE-02',
    code: 'EST-02',
    name: 'Rio Aricanduva',
    location: 'Av. Aricanduva · Cidade Líder',
    zone: 'Zona Leste — Bacia Aricanduva',
    schematic: { x: 55, y: 50 },
    attentionLevel: 55,
    criticalLevel: 75,
    reportIntervalSec: 30,
    batteryPct: 88,
    packetLossPct: 35,
    localSignalling: true,
    sim: {
      behavior: 'lossy',
      floor: 28, rise: 17, tau: 90, driftCmMin: 0.19, dropProbability: 0.35,
      pastBump: { amp: 30, centerMin: 300, widthMin: 40 },
    },
  },
  {
    id: 'ESP32-NODE-03',
    code: 'EST-03',
    name: 'Córrego Pirajuçara',
    location: 'Av. Eliseu de Almeida · Butantã',
    zone: 'Zona Oeste — Bacia Pinheiros',
    schematic: { x: 78, y: 78 },
    attentionLevel: 65,
    criticalLevel: 90,
    reportIntervalSec: 30,
    batteryPct: 41,
    packetLossPct: null,
    localSignalling: true,
    sim: { behavior: 'offline', floor: 36, rise: 5, tau: 200, lastSeenMinAgo: 47 },
  },
  {
    id: 'ESP32-NODE-04',
    code: 'EST-04',
    name: 'Rio Tietê',
    location: 'Ponte das Bandeiras · Marginal',
    zone: 'Zona Norte — Calha Central',
    schematic: { x: 38, y: 78 },
    attentionLevel: 45,
    criticalLevel: 70,
    reportIntervalSec: 30,
    batteryPct: 76,
    packetLossPct: 4,
    localSignalling: true,
    sim: { behavior: 'sensor_fault', floor: 22, rise: 3, tau: 120, lastSeenMinAgo: 40 },
  },
]

// Posições esquemáticas (simuladas) para nós cadastrados na interface.
export const SCHEMATIC_SLOTS = [
  { x: 14, y: 62 }, { x: 64, y: 22 }, { x: 88, y: 46 }, { x: 52, y: 90 },
  { x: 10, y: 88 }, { x: 90, y: 12 },
]

// Episódios anteriores já encerrados. Os horários são relativos ao início da
// simulação e coerentes com os picos gerados em `pastBump` acima.
export const SEED_PAST_ALERTS = [
  {
    id: 'ALT-091', nodeId: 'ESP32-NODE-02', category: 'risk', severity: 'moderate',
    title: 'Risco moderado no ponto',
    reason: 'Nível ultrapassou a cota de atenção e voltou ao normal em seguida.',
    startedMinAgo: 314, resolvedMinAgo: 286,
  },
  {
    id: 'ALT-090', nodeId: 'ESP32-NODE-01', category: 'risk', severity: 'moderate',
    title: 'Risco moderado no ponto',
    reason: 'Nível ultrapassou a cota de atenção e voltou ao normal em seguida.',
    startedMinAgo: 615, resolvedMinAgo: 585,
  },
]