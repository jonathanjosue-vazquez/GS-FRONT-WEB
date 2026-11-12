// Vocabulário do domínio: classificação de risco e estados de conexão.
// Risco (nível da água) e conexão (saúde do dispositivo) são conceitos
// independentes e nunca compartilham o mesmo campo.

export const AREA_NAME = 'Bacia do Alto Tietê — Região Metropolitana'
export const RISK_ORDER = ['normal', 'attention', 'moderate', 'high', 'critical']

export const RISK_LABELS = {
  normal: 'Normal',
  attention: 'Atenção',
  moderate: 'Moderado',
  high: 'Alto',
  critical: 'Crítico',
}

// Critério usado por classifyRisk (services/analysis.js), exibido na tela de alertas.
export const RISK_CRITERIA = {
  normal: 'Sem tendência de subida relevante e abaixo da cota de atenção.',
  attention: 'Nível subindo a pelo menos 0,12 cm/min, ainda abaixo da cota de atenção.',
  moderate: 'Nível na cota de atenção ou acima, ou cota crítica estimada em até 60 min.',
  high: 'Nível a 85% ou mais da cota crítica, ou cota crítica estimada em até 15 min.',
  critical: 'Nível na cota crítica ou acima.',
}

// Orientações curtas para a população. Não substituem a Defesa Civil.
export const RISK_GUIDANCE = {
  attention: [
    'Acompanhe a evolução do nível nos próximos minutos.',
    'Evite estacionar perto do ponto monitorado.',
  ],
  moderate: [
    'Evite permanecer em áreas próximas ao ponto monitorado.',
    'Não atravesse ruas com água acima do meio-fio.',
    'Acompanhe os comunicados oficiais da Defesa Civil.',
  ],
  high: [
    'Evite circular em áreas próximas ao ponto monitorado.',
    'Não atravesse ruas alagadas, a pé ou de carro.',
    'Acompanhe os comunicados oficiais da Defesa Civil.',
  ],
  critical: [
    'Busque um local seguro se houver orientação das autoridades.',
    'Não atravesse ruas alagadas, a pé ou de carro.',
    'Em emergência, ligue para a Defesa Civil: 199.',
  ],
}

// Ação sugerida à equipe técnica que opera a plataforma.
export const RISK_OPERATOR_ACTION = {
  attention: 'Manter acompanhamento do ponto.',
  moderate: 'Intensificar o monitoramento e avisar a equipe de prevenção.',
  high: 'Comunicar a Defesa Civil local e preparar bloqueio da via marginal.',
  critical: 'Acionar a Defesa Civil imediatamente e confirmar o ponto em campo.',
}

export const CONNECTION_LABELS = {
  online: 'Online',
  unstable: 'Instável',
  stale: 'Dados desatualizados',
  offline: 'Offline',
}

export const CONNECTION_HINTS = {
  online: 'Comunicando e enviando leituras no intervalo esperado.',
  unstable: 'Enviando leituras, mas com perda de pacotes acima de 20%.',
  stale: 'O nó comunica, mas o sensor não envia leitura válida. A cota exibida é antiga.',
  offline: 'Sem comunicação. Nenhum dado novo chega deste nó.',
}
