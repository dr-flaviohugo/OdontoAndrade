const axios = require('axios');
const { withRetry } = require('./middleware/errorHandler');

function buildPrompt(text, { tone = 'profissional e cordial', language = 'pt-BR' } = {}) {
  return `Você é um assistente de escrita para uma clínica odontológica.
Revise, corrija gramática e melhore a clareza, mantendo o tom ${tone}.
Se fizer sentido, inclua uma chamada para ação breve e educada (ex.: agendar consulta).
Responda no idioma: ${language}.
Mensagem original:\n\n${text}`;
}

async function improveWithOpenAI({ text, tone, language }) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';
  const temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.6;
  const maxTokens = parseInt(process.env.AI_MAX_TOKENS) || 500;
  const timeout = parseInt(process.env.AI_TIMEOUT) || 30000;
  const prompt = buildPrompt(text, { tone, language });

  const { data } = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model,
      messages: [
        { role: 'system', content: 'Você melhora mensagens para atendimento profissional em uma clínica odontológica.' },
        { role: 'user', content: prompt }
      ],
      temperature,
      max_tokens: maxTokens,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout,
    }
  );

  const choice = data.choices?.[0]?.message?.content?.trim();
  if (!choice) throw new Error('Falha ao obter resposta da OpenAI');
  return choice;
}

async function improveWithGemini({ text, tone, language }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.6;
  const timeout = parseInt(process.env.AI_TIMEOUT) || 30000;
  const prompt = buildPrompt(text, { tone, language });

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const { data } = await axios.post(
    endpoint,
    {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature,
      },
    },
    { timeout }
  );

  const textOut = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!textOut) throw new Error('Falha ao obter resposta do Gemini');
  return textOut;
}

// Wrapping com retry
const improveWithOpenAIRetry = withRetry(improveWithOpenAI, {
  maxRetries: 3,
  baseDelay: 1000,
  context: 'OpenAI API'
});

const improveWithGeminiRetry = withRetry(improveWithGemini, {
  maxRetries: 3,
  baseDelay: 1000,
  context: 'Gemini API'
});

async function improveText({ text, tone, language }) {
  if (!text || !text.trim()) {
    throw new Error('Texto não informado');
  }

  const provider = (process.env.AI_PROVIDER || '').toLowerCase();
  if (provider === 'gemini' || (!process.env.OPENAI_API_KEY && process.env.GEMINI_API_KEY)) {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY ausente');
    return improveWithGeminiRetry({ text, tone, language });
  }

  // default: OpenAI
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY ausente');
  return improveWithOpenAIRetry({ text, tone, language });
}

module.exports = { improveText };
