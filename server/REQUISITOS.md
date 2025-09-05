Requisitos e Pendências — WhatsApp AI Assistant

Objetivo
- **Propósito:** Melhorar e padronizar mensagens comerciais de uma clínica odontológica usando IA e enviar via API oficial do WhatsApp.

Escopo Atual (implementado)
- **Backend:** Node.js + Express configurado em `server/src/index.js`.
- **IA:** OpenAI e Gemini com seleção via `AI_PROVIDER` em `server/src/ai.js`.
- **Envios WhatsApp:** Integração com Cloud API em `server/src/whatsapp.js` (texto simples).
- **Webhooks:** Verificação (`GET /webhook`) e recepção (`POST /webhook`) — armazenamento de mensagens recebidas e atualização de status.
- **Armazenamento (MVP):** Arquivo JSON em `server/data/messages.json` via `server/src/store.js`.
- **Endpoints:**
  - `GET /` — health check.
  - `POST /api/improve-text` — melhora texto com IA.
  - `POST /api/send-message` — (opcionalmente) melhora e envia; persiste histórico.
  - `GET /api/inbox` — lista conversas (última mensagem por número).
  - `GET /api/messages?phone=E164` — lista mensagens da conversa.
- **Frontend (MVP):** Vite + React em `web/` com:
  - Compor, melhorar (prévia editável) e enviar mensagens.
  - Templates rápidos.
  - Inbox com conversas e visualização de thread + status.

Requisitos Funcionais
- **Melhoria de texto:** Corrigir gramática, clareza e tom profissional em pt-BR.
- **Envio WhatsApp:** Enviar mensagens para números internacionais (sem +) pelo Cloud API.
- **Aprovação humana:** Exibir versão melhorada para confirmar antes do envio.
- **Templates e tons:** Suportar tons e modelos (saudação, lembrete, orçamento, follow-up).
- **Contexto do atendimento:** Permitir informar nome do paciente, horário, procedimento, valores.
- **Histórico:** Registrar mensagens originais, melhoradas, status e metadados.
- **Entrada via webhook:** Processar mensagens recebidas e atualizar status de entrega/leitura.

Requisitos Não Funcionais
- **Confiabilidade:** Repetição com backoff em falhas transitórias no Graph API.
- **Desempenho:** P95 de melhoria+envio < 3s (considerando latência de IA).
- **Custo:** Seleção de modelos e temperatura para otimizar custos/qualidade.
- **Segurança:** Autenticação nos endpoints; gestão segura de segredos.
- **Observabilidade:** Logs estruturados, correlação de requisições, métricas básicas.

Integrações
- **WhatsApp Cloud API:** Envio de mensagens e webhooks de eventos.
- **OpenAI/Gemini:** Geração de texto aprimorado.
- **Agenda/CRM (opcional):** Integração futura para horários e dados do paciente.

Segurança e Conformidade (LGPD)
- **Bases legais:** Consentimento/legítimo interesse para comunicações.
- **Minimização:** Armazenar o mínimo necessário; evitar dados sensíveis em logs.
- **Retenção:** Políticas de retenção/anonimização do histórico.
- **Acesso:** Controle por papéis; auditoria de ações.

DevOps e Deploy
- **Ambientes:** Dev/Prod com `.env` separados.
- **CI/CD:** Lint, testes e deploy automatizado.
- **Infra:** Docker (opcional), hospedagem gerenciada.
- **Segredos:** Variáveis de ambiente; nunca expor no frontend.

Pendências (Backlog atualizado)
- Backend
  - **Autenticação/Autorização** nos endpoints (API key/JWT) + CORS restrito.
  - **Validações** robustas (número E.164, limites de tamanho, rate limiting).
  - **Tratamento de erros** + retries/backoff WhatsApp/IA; timeouts e circuit breaker.
  - **Banco de dados** para histórico (SQLite/Postgres) com modelos: contatos, mensagens, eventos (migrar do JSON).
  - **Respostas automáticas** (baseadas em templates e intent simples) no webhook inbound.
  - **Templates e tons** configuráveis (JSON/DB) com placeholders; UI de gestão.
  - **Idempotência** para envios e processamento de webhooks.
  - **Mídias** (imagens/PDF) e mensagens interativas (botões, listas).
  - **Content safety** básico (bloqueio/aviso para termos inadequados).
  - **Cache** de prompts comuns e versionamento de prompts.
  - **Testes** unitários e de integração (mocks OpenAI/Gemini/Graph API).
- Frontend
  - **Inbox avançado:** busca, paginação, indicadores de não lidas.
  - **Ações rápidas:** respostas prontas e variáveis de contexto na thread.
  - **Validações UI:** número E.164, feedback de erro, estados de carregamento.
  - **Preferências:** tom/temperatura/modelo por usuário.
- Operação
  - **Logs estruturados** (JSON) e correlação por request id.
  - **Métricas** (latência, taxa de erro, custos estimados por modelo).
  - **Alertas** (latência alta, falhas repetidas de envio/webhook).

Critérios de Aceite (exemplos)
- **CA1:** `POST /api/improve-text` retorna texto melhorado preservando intenção.
- **CA2:** `POST /api/send-message` com `autoImprove=true` envia ao WhatsApp e retorna ID do envio e corpo final.
- **CA3:** `GET /webhook` com token válido retorna `hub.challenge` (200).
- **CA4:** `POST /webhook` com evento de mensagem recebida persiste no histórico e responde 200 em < 2s.
- **CA5:** `GET /api/inbox` lista conversas após receber webhooks.
- **CA6:** `GET /api/messages?phone=...` retorna a thread em ordem cronológica.

Variáveis de Ambiente (referência)
- **PORT:** Porta do servidor.
- **AI_PROVIDER / AI_MODEL:** Seleção e modelo da IA.
- **OPENAI_API_KEY / GEMINI_API_KEY / GEMINI_MODEL:** Chaves/modelos de IA.
- **WHATSAPP_TOKEN / WHATSAPP_PHONE_ID / WA_API_VERSION:** Credenciais WhatsApp.
- **WEBHOOK_VERIFY_TOKEN:** Token de verificação do webhook.

Testes Manuais Rápidos
- `POST /api/improve-text` com uma mensagem de teste e verificar retorno melhorado.
- `POST /api/send-message` para um número autorizado no sandbox do WhatsApp Cloud API.
- `GET /webhook` com `hub.verify_token` correto deve retornar `hub.challenge`.
- `POST /webhook` com payload de exemplo deve registrar a mensagem em `GET /api/inbox`.
- `GET /api/messages?phone=...` deve listar a thread.

Notas de Implementação (MVP)
- Armazenamento atual em arquivo JSON (Windows-friendly). Para produção, migrar para SQLite/Postgres (ex.: Prisma) e habilitar índices/queries.
