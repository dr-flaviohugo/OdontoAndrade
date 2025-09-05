WhatsApp AI Frontend (Vite + React)

Overview
- MVP para compor, revisar com IA e enviar mensagens via backend em `server/`.

Setup
- Copie `.env.example` para `.env` e ajuste:
  - `VITE_API_BASE_URL=http://localhost:3000`

Scripts
- `npm run dev` — roda o servidor de desenvolvimento (porta padrão 5173)
- `npm run build` — build de produção
- `npm run preview` — preview do build

Fluxo
- Preencha número E.164 (sem +), mensagem, tom/idioma.
- Use “Melhorar texto com IA” para gerar a versão sugerida.
- Edite a prévia se quiser e clique “Enviar via WhatsApp”.
- Opcional: marque “Melhorar automaticamente ao enviar”.

Requisitos
- Backend rodando em `http://localhost:3000` com CORS habilitado (já está).
- Variáveis de ambiente configuradas no backend (`server/.env`).

Observações
- O MVP não lista mensagens recebidas. Para inbox/threads, será necessário armazenar webhooks e expor endpoints no backend.
