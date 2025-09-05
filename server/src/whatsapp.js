const axios = require('axios');
const { withRetry } = require('./middleware/errorHandler');

async function sendWhatsAppText({ to, message }) {
  if (!to) throw new Error('Campo "to" (destinatário) é obrigatório');
  if (!message) throw new Error('Campo "message" é obrigatório');

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const version = process.env.WA_API_VERSION || 'v21.0';
  const timeout = parseInt(process.env.AI_TIMEOUT) || 30000;
  
  if (!token || !phoneId) throw new Error('Credenciais do WhatsApp ausentes');

  const url = `https://graph.facebook.com/${version}/${phoneId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message },
  };

  const { data } = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    timeout,
  });

  return data;
}

// Wrapper com retry para envios do WhatsApp
const sendWhatsAppTextWithRetry = withRetry(sendWhatsAppText, {
  maxRetries: 3,
  baseDelay: 2000, // WhatsApp pode ter rate limits, delay maior
  context: 'WhatsApp API'
});

module.exports = { sendWhatsAppText: sendWhatsAppTextWithRetry };
