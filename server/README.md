WhatsApp AI Assistant (Node.js)

Overview
- Express backend that improves messages using OpenAI or Gemini and sends via WhatsApp Cloud API. Includes webhook verification and receiver endpoints.

Setup
- Copy `server/.env.example` to `server/.env` and fill values:
  - `OPENAI_API_KEY` or `GEMINI_API_KEY`
  - `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_ID`, `WA_API_VERSION`
  - `WEBHOOK_VERIFY_TOKEN`

Install
- From repo root:
  - `cd server`
  - `npm install`

Run
- Development: `npm run dev`
- Production: `npm start`

Endpoints
- `GET /` health check
- `POST /api/improve-text` -> `{ text, tone?, language? }` => `{ improvedText }`
- `POST /api/send-message` -> `{ to, message, autoImprove?, tone?, language? }` => `{ improvedText, whatsapp }`
- `GET /webhook` (WhatsApp verification)
- `POST /webhook` (WhatsApp incoming events)
 - `GET /api/inbox` -> lista conversas (por número) com última mensagem
 - `GET /api/messages?phone=E164` -> mensagens da conversa

Notes
- Phone numbers must be in international format without `+`.
- Default provider: `AI_PROVIDER=openai` when `OPENAI_API_KEY` is set; falls back to Gemini if configured.
- Adjust `AI_MODEL`/`GEMINI_MODEL` as needed.
- Storage: por padrão usa arquivo JSON em `server/data/messages.json` (MVP). Produção: considerar banco relacional.
