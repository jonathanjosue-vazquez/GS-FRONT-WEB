# PrevIA Hydro — Plataforma de Monitoramento Hidrológico e Prevenção

> Projeto desenvolvido para a **Global Solution 2026.2 — Engenharia de Software (FIAP)**.

O **PrevIA Hydro** é uma plataforma web integrada a sensores IoT voltada ao monitoramento contínuo do nível da água em áreas urbanas vulneráveis a alagamentos e enchentes. Em vez de atuar apenas de forma reativa quando o transbordamento já ocorreu, o sistema calcula a **taxa de elevação (cm/min)**, identifica tendências de risco e emite alertas preventivos com orientações práticas para a população e equipes locais.

---

## Principais Funcionalidades

- **Monitoramento em Tempo Real:** Acompanhamento da cota atual da água em múltiplos pontos estratégicos da bacia urbana.
- **Análise de Velocidade e Tendência:** Cálculo da velocidade de subida do nível da água e estimativa de tempo até atingir a cota crítica de transbordamento.
- **Operação Offline Resiliente (Edge):** Os nós baseados em ESP32 contam com sinalização local via LEDs e buzzer para alertar moradores próximos mesmo em caso de queda de energia ou perda de conexão com a internet.
- **Diagnóstico de Integridade:** Detecção automática de sensores desconectados, perda de pacotes ou leituras desatualizadas.
- **Central de Protocolos e Alertas:** Exibição de nível de risco acompanhado de recomendações objetivas de segurança.

---

## Arquitetura do Sistema

O fluxo de dados do projeto foi estruturado em quatro camadas:

```text
[Sensores + ESP32] ──▶ [Processamento Python] ──▶ [API / Banco de Dados] ──▶ [Dashboard Web React]
