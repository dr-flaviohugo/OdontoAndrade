require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { improveText } = require('./ai');
const { sendWhatsAppText } = require('./whatsapp');
const { saveInbound, saveOutbound, updateStatus, listInbox, listThread } = require('./store');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'whatsapp-ai-assistant', time: new Date().toISOString() });
});

// Improve text only
app.post('/api/improve-text', async (req, res) => {
  try {
    const { text, tone, language } = req.body || {};
    const improvedText = await improveText({ text, tone, language });
    res.json({ improvedText });
  } catch (err) {
    const msg = err?.response?.data || err?.message || 'Erro inesperado';
    console.error('improve-text error:', msg);
    res.status(400).json({ error: msg });
  }
});

// Send message (optionally auto-improve before sending)
app.post('/api/send-message', async (req, res) => {
  try {
    const { to, message, autoImprove = true, tone, language } = req.body || {};
    if (!to) return res.status(400).json({ error: 'Campo "to" é obrigatório' });
    if (!message) return res.status(400).json({ error: 'Campo "message" é obrigatório' });

    const finalText = autoImprove ? await improveText({ text: message, tone, language }) : message;
    const waResp = await sendWhatsAppText({ to, message: finalText });
    const waId = waResp?.messages?.[0]?.id || waResp?.messages?.[0]?.message_id || null;
    saveOutbound({ phone: to, body: finalText, waId, status: 'sent', ts: Date.now() });
    res.json({ improvedText: finalText, whatsapp: waResp });
  } catch (err) {
    const msg = err?.response?.data || err?.message || 'Erro inesperado';
    console.error('send-message error:', msg);
    res.status(400).json({ error: msg });
  }
});

// WhatsApp Webhook verification
app.get('/webhook', (req, res) => {
  const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// WhatsApp Webhook receiver
app.post('/webhook', (req, res) => {
  try {
    const body = req.body;
    const entries = body?.entry || [];
    for (const entry of entries) {
      const changes = entry?.changes || [];
      for (const change of changes) {
        const value = change?.value || {};
        // Messages (inbound)
        const messages = value?.messages || [];
        for (const msg of messages) {
          try {
            if (msg.type === 'text') {
              const phone = msg.from; // sender's phone
              const waId = msg.id;
              const ts = (Number(msg.timestamp) || Math.floor(Date.now()/1000)) * 1000;
              const bodyText = msg.text?.body || '';
              saveInbound({ phone, body: bodyText, waId, ts, status: 'received' });
            }
          } catch (innerErr) {
            console.error('save inbound error:', innerErr);
          }
        }
        // Status updates (delivery/read)
        const statuses = value?.statuses || [];
        for (const st of statuses) {
          const waId = st.id;
          const status = st.status; // sent, delivered, read, failed
          const ts = (Number(st.timestamp) || Math.floor(Date.now()/1000)) * 1000;
          updateStatus({ waId, status, ts });
        }
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('webhook error:', err);
    res.sendStatus(500);
  }
});

// Inbox and thread APIs
app.get('/api/inbox', (req, res) => {
  try {
    const items = listInbox({ limit: 100 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

app.get('/api/messages', (req, res) => {
  try {
    const phone = String(req.query.phone || '');
    if (!phone) return res.status(400).json({ error: 'phone é obrigatório' });
    const items = listThread({ phone, limit: 200 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
