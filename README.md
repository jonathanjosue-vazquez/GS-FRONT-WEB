# PrevIA Hydro — Monitoramento hidrológico e prevenção de alagamentos

Projeto da **Global Solution 2026.2 — FIAP (Engenharia de Software, 1º ano)**, desafio **CitizenTech**.

> **Ficha da CitizenTech** — *(completar com a equipe)*
> Nome: PrevIA Hydro · Cidade e bairro: … · Cidadão beneficiado: … · Problema em uma frase: … ·
> Indicador de impacto: … · ODS conectados: … (ex.: 11 e 13)

O PrevIA Hydro é a plataforma web de uma solução com sensores ESP32 que medem o nível da água em pontos vulneráveis a
alagamentos. A plataforma mostra a cota atual, a **taxa de elevação (cm/min)**, a tendência, o estado dos sensores e
alertas com orientações curtas à população.

O sistema **não prevê enchentes**. Ele monitora, analisa tendências e classifica condições de risco. Não substitui a Defesa Civil.

## Dados simulados

Enquanto a API da equipe não existe, toda a telemetria é **simulada** (`src/services/mockRepository.js`). A interface avisa isso
na barra lateral. A simulação gera 24 h de histórico e continua emitindo leituras a cada 30 s. O botão
**Reiniciar simulação** volta ao cenário inicial (útil para a demonstração).

## Como executar

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # testes da lógica de análise (node:test, sem dependências)
npm run build    # build de produção em dist/
```

Pré-requisito: Node.js 20 ou superior.

## Telas

| Rota | Tela | O que faz |
|---|---|---|
| `/#/` | Visão Geral | KPIs, gráfico da última hora, alertas ativos, integridade da rede |
| `/#/mapa` | Mapa & Pontos | Mapa esquemático interativo, filtro por risco, inspeção do ponto |
| `/#/historico` | Séries Históricas | Ponto, período (1/6/24 h), filtro de cota, comparação com período anterior, estatísticas, tabela, CSV |
| `/#/nos` | Nós ESP32 | Estado de conexão, detalhes, cadastro, edição e exclusão de nós |
| `/#/alertas` | Protocolos & Alertas | Alertas ativos e anteriores, filtros, reconhecimento, regras de classificação |

## Regras de negócio

- **Risco** (nível da água): Normal, Atenção, Moderado, Alto, Crítico. Critérios em `src/data/domain.js`, aplicados em `classifyRisk`.
- **Conexão** (saúde do dispositivo): Online, Instável, Dados desatualizados, Offline. É independente do risco.
- **Taxa de elevação**: regressão linear das leituras dos últimos 10 min. Sem pontos suficientes, a taxa fica indisponível.
- **Tempo até a cota crítica**: extrapolação linear simplificada. Não é calculado se a taxa for nula, negativa, inválida ou muito baixa.
- **Integridade da rede**: nós com leitura recente (online + instáveis) ÷ nós cadastrados.
- Um nó offline ou com dados desatualizados **não alimenta** cota, taxa, estimativa nem risco.

## Arquitetura

```text
src/
├── components/   layout/ ui/ dashboard/ charts/ monitoring/ history/ devices/ alerts/
├── context/      MonitoringProvider (dados + ações), ToastProvider (feedback)
├── hooks/        useMonitoringData, useHistory, useAlertFilters, useMonitoring, useToast
├── pages/        Dashboard, Monitoring, History, Devices, Alerts
├── services/     analysis (lógica pura + testes), alertRules, monitoringService, mockRepository, validation, format, export
└── data/         domain (vocabulário e regras), mockTelemetry (cenário simulado)
```

Fluxo: `componentes → hooks/contexto → monitoringService → mockRepository`. Para integrar a API real, troque apenas o
`mockRepository` dentro do `monitoringService`; as telas continuam iguais.

## Pendências de integração

- Contrato real de dados com a equipe de Python/Edge (campos, unidades, intervalo de envio).
- API externa com CRUD (exigência da disciplina): hoje o CRUD de nós roda sobre o repositório simulado em memória.
- Deploy e README final com os nomes da equipe.

Uso de IA documentado em [`AI.md`](./AI.md).
