const rateLimit = require('express-rate-limit');

// Middleware de autenticação por API Key
function authenticateApiKey(req, res, next) {
  const apiKey = process.env.API_KEY;
  
  // Se não há API_KEY configurada, pular autenticação (desenvolvimento)
  if (!apiKey) {
    return next();
  }
  
  const providedKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!providedKey || providedKey !== apiKey) {
    return res.status(401).json({ 
      error: 'Não autorizado. API key necessária.',
      code: 'UNAUTHORIZED'
    });
  }
  
  next();
}

// Rate limiting configurável
function createRateLimit(options = {}) {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000; // 15 minutos
  const max = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
  
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Muitas requisições. Tente novamente mais tarde.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options
  });
}

// Rate limit específico para APIs de IA (mais restritivo)
const aiRateLimit = createRateLimit({
  windowMs: 60000, // 1 minuto
  max: 20, // 20 requisições por minuto
  message: {
    error: 'Muitas requisições para IA. Tente novamente em 1 minuto.',
    code: 'AI_RATE_LIMIT_EXCEEDED'
  }
});

// Rate limit para envio de mensagens (ainda mais restritivo)
const messageRateLimit = createRateLimit({
  windowMs: 60000, // 1 minuto  
  max: 10, // 10 mensagens por minuto
  message: {
    error: 'Muitas mensagens enviadas. Tente novamente em 1 minuto.',
    code: 'MESSAGE_RATE_LIMIT_EXCEEDED'
  }
});

module.exports = {
  authenticateApiKey,
  createRateLimit,
  aiRateLimit,
  messageRateLimit
};
