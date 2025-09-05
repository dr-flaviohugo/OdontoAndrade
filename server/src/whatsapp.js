const axios = require('axios');

async function sendWhatsAppText({ to, message }) {
  if (!to) throw new Error('Campo "to" (destinatário) é obrigatório');
  if (!message) throw new Error('Campo "message" é obrigatório');

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const version = process.env.WA_API_VERSION || 'v21.0';
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
    timeout: 30000,
  });

  return data;
}

module.exports = { sendWhatsAppText };
