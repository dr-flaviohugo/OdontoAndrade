# WhatsApp AI Assistant

Sistema de assistente de IA para melhorar e enviar mensagens comerciais de uma clínica odontológica via WhatsApp Cloud API.

## 🚀 Características Implementadas

### ✅ Funcionalidades Principais
- **Melhoria de texto com IA**: OpenAI GPT-4o-mini ou Google Gemini
- **Envio via WhatsApp**: Integração com Cloud API oficial
- **Webhooks**: Recepção de mensagens e atualizações de status
- **Histórico**: Armazenamento de conversas em JSON (migração para DB planejada)
- **Interface Web**: Frontend React para gerenciar conversas

### ✅ Melhorias de Segurança e Confiabilidade
- **Autenticação**: API Key opcional para proteger endpoints
- **Rate Limiting**: Controle de taxa configurável por endpoint
- **Validações**: Validação robusta de dados de entrada
- **Retry com Backoff**: Tentativas automáticas em falhas transitórias
- **Logs estruturados**: Rastreamento de erros com correlation ID
- **Tratamento de erros**: Respostas padronizadas e informativas

### ✅ Validações Implementadas
- Números de telefone E.164 (ex: 5561999999999)
- Tamanho de mensagens (máximo 4096 caracteres)
- Tons válidos: profissional e cordial, amigável, objetivo, formal, casual
- Idiomas suportados: pt-BR, en-US, es-ES

## 📋 Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Conta WhatsApp Business (para produção)
- API Key OpenAI ou Google Gemini

## 🛠️ Instalação

```bash
# Clonar repositório
git clone https://github.com/dr-flaviohugo/OdontoAndrade.git
cd OdontoAndrade/server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais
```

## ⚙️ Configuração

### Variáveis de Ambiente Obrigatórias

```env
# IA (escolher um)
OPENAI_API_KEY=sk-your-key-here
# OU
GEMINI_API_KEY=your-gemini-key-here

# WhatsApp (para produção)
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_ID=your-phone-id
WEBHOOK_VERIFY_TOKEN=your-webhook-token
```

### Variáveis Opcionais

```env
# Servidor
PORT=3000
NODE_ENV=development

# Segurança
API_KEY=your-api-key-for-auth
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# IA
AI_PROVIDER=openai
AI_TEMPERATURE=0.6
AI_MAX_TOKENS=500
AI_TIMEOUT=30000
```

## 🚀 Execução

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Testes
npm test
```

## 📡 API Endpoints

### Health Check
```http
GET /
```

### Melhorar Texto
```http
POST /api/improve-text
Content-Type: application/json
X-API-Key: your-api-key (opcional)

{
  "text": "oi queria marcar consulta",
  "tone": "profissional e cordial",
  "language": "pt-BR"
}
```

### Enviar Mensagem
```http
POST /api/send-message
Content-Type: application/json
X-API-Key: your-api-key (opcional)

{
  "to": "5561999999999",
  "message": "Olá, gostaria de agendar uma consulta",
  "autoImprove": true,
  "tone": "profissional e cordial",
  "language": "pt-BR"
}
```

### Listar Conversas
```http
GET /api/inbox
X-API-Key: your-api-key (opcional)
```

### Visualizar Thread
```http
GET /api/messages?phone=5561999999999
X-API-Key: your-api-key (opcional)
```

### Webhook WhatsApp
```http
GET /webhook?hub.mode=subscribe&hub.verify_token=TOKEN&hub.challenge=CHALLENGE
POST /webhook
```

## 🔒 Segurança

### Rate Limits
- **Global**: 100 requisições por 15 minutos
- **IA**: 20 requisições por minuto  
- **Mensagens**: 10 envios por minuto

### Autenticação
- Header `X-API-Key: your-key` ou `Authorization: Bearer your-key`
- Opcional (pular se API_KEY não configurada)

## 🧪 Testes

```bash
# Testar todos os endpoints
npm test

# Teste manual específico
curl -X POST http://localhost:3000/api/improve-text \
  -H "Content-Type: application/json" \
  -d '{"text":"oi tudo bem"}'
```

## 🛠️ Frontend

```bash
cd ../web
npm install
npm run dev
# Acessar http://localhost:5173
```

## 📁 Estrutura do Projeto

```
server/
├── src/
│   ├── index.js              # Servidor principal
│   ├── ai.js                 # Integração IA
│   ├── whatsapp.js           # API WhatsApp
│   ├── store.js              # Armazenamento JSON
│   └── middleware/
│       ├── auth.js           # Autenticação e rate limiting
│       ├── validation.js     # Validações
│       └── errorHandler.js   # Tratamento de erros
├── tests/
│   └── test-endpoints.js     # Testes automatizados
├── data/
│   └── messages.json         # Histórico de mensagens
└── .env.example              # Exemplo de configuração
```

## 🔄 Próximos Passos

### Pendências Prioritárias
- [ ] Migração para banco de dados (SQLite/PostgreSQL)
- [ ] Templates de mensagem configuráveis
- [ ] Respostas automáticas básicas
- [ ] Suporte a mídias (imagens, documentos)
- [ ] Mensagens interativas (botões, listas)
- [ ] Dashboard de métricas
- [ ] Testes unitários automatizados

### Melhorias Futuras
- [ ] Integração com CRM/agenda
- [ ] Content safety (filtros de conteúdo)
- [ ] Múltiplos usuários e permissões
- [ ] Backup automático de dados
- [ ] Monitoramento e alertas

## 🐛 Troubleshooting

### Erro "API key ausente"
- Configurar `OPENAI_API_KEY` ou `GEMINI_API_KEY` no .env

### Erro "Credenciais do WhatsApp ausentes"  
- Configurar `WHATSAPP_TOKEN` e `WHATSAPP_PHONE_ID` no .env

### Rate limit atingido
- Aguardar o tempo de reset ou ajustar limites no .env

### Webhook não funciona
- Verificar `WEBHOOK_VERIFY_TOKEN` no .env
- URL do webhook deve ser acessível publicamente (ngrok para desenvolvimento)

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar logs do servidor
2. Consultar correlation ID nos headers de resposta
3. Revisar configuração das variáveis de ambiente

## 📄 Licença

Este projeto é privado e proprietário da Clínica Odontológica.
