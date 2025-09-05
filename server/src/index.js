require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { improveText } = require('./ai');
const { sendWhatsAppText } = require('./whatsapp');
const { saveInbound, saveOutbound, updateStatus, listInbox, listThread } = require('./store');

// Importar middleware de segurança e validação
const { authenticateApiKey, aiRateLimit, messageRateLimit, createRateLimit } = require('./middleware/auth');
const { 
  validateImproveTextRequest, 
  validateSendMessageRequest, 
  validateMessagesRequest 
} = require('./middleware/validation');
const { 
  addCorrelationId, 
  errorHandler, 
  asyncHandler 
} = require('./middleware/errorHandler');

const app = express();

// Middleware básico
app.use(addCorrelationId);
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Rate limiting global
app.use(createRateLimit());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'whatsapp-ai-assistant', time: new Date().toISOString() });
});

// Improve text only
app.post('/api/improve-text', 
  authenticateApiKey,
  aiRateLimit,
  validateImproveTextRequest,
  asyncHandler(async (req, res) => {
    const { text, tone, language } = req.body;
    const improvedText = await improveText({ text, tone, language });
    res.json({ 
      improvedText,
      correlationId: req.correlationId 
    });
  })
);

// Send message (optionally auto-improve before sending)
app.post('/api/send-message',
  authenticateApiKey,
  messageRateLimit,
  validateSendMessageRequest,
  asyncHandler(async (req, res) => {
    const { to, message, autoImprove = true, tone, language } = req.body;

    const finalText = autoImprove ? await improveText({ text: message, tone, language }) : message;
    const waResp = await sendWhatsAppText({ to, message: finalText });
    const waId = waResp?.messages?.[0]?.id || waResp?.messages?.[0]?.message_id || null;
    
    saveOutbound({ phone: to, body: finalText, waId, status: 'sent', ts: Date.now() });
    
    res.json({ 
      improvedText: finalText, 
      whatsapp: waResp,
      correlationId: req.correlationId
    });
  })
);

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
app.post('/webhook', asyncHandler(async (req, res) => {
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
            const phone = msg.from;
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
        const status = st.status;
        const ts = (Number(st.timestamp) || Math.floor(Date.now()/1000)) * 1000;
        updateStatus({ waId, status, ts });
      }
    }
  }
  
  res.sendStatus(200);
}));

// Inbox and thread APIs
app.get('/api/inbox',
  authenticateApiKey,
  asyncHandler(async (req, res) => {
    const items = listInbox({ limit: 100 });
    res.json({ 
      items,
      correlationId: req.correlationId 
    });
  })
);

app.get('/api/messages',
  authenticateApiKey,
  validateMessagesRequest,
  asyncHandler(async (req, res) => {
    const { phone } = req.query;
    const items = listThread({ phone, limit: 200 });
    res.json({ 
      items,
      correlationId: req.correlationId 
    });
  })
);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'openai'}`);
});
