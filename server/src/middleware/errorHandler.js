const crypto = require('crypto');

// Gerador de ID de correlação
function generateCorrelationId() {
  return crypto.randomUUID();
}

// Middleware para adicionar correlation ID
function addCorrelationId(req, res, next) {
  req.correlationId = req.headers['x-correlation-id'] || generateCorrelationId();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
}

// Logger estruturado
function logError(error, req, additionalInfo = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    correlationId: req?.correlationId || 'unknown',
    method: req?.method,
    url: req?.url,
    userAgent: req?.headers?.['user-agent'],
    ip: req?.ip || req?.connection?.remoteAddress,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    },
    ...additionalInfo
  };
  
  console.error(JSON.stringify(logEntry));
}

// Função de retry com backoff exponencial
async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Verificar se é um erro que vale a pena tentar novamente
      if (!shouldRetry(error)) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`Tentativa ${attempt} falhou, tentando novamente em ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Determinar se um erro deve ser retentado
function shouldRetry(error) {
  // Erros de rede/temporários que podem ser retentados
  const retryableErrors = [
    'ECONNRESET',
    'ENOTFOUND',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'EHOSTUNREACH'
  ];
  
  // Status HTTP que podem ser retentados
  const retryableStatuses = [429, 500, 502, 503, 504];
  
  return (
    retryableErrors.includes(error.code) ||
    retryableStatuses.includes(error.response?.status) ||
    error.message?.includes('timeout') ||
    error.message?.includes('network')
  );
}

// Wrapper para APIs externas com retry
function withRetry(apiFunction, options = {}) {
  return async function(...args) {
    const { maxRetries = 3, baseDelay = 1000, context = 'API call' } = options;
    
    return retryWithBackoff(
      () => apiFunction(...args),
      maxRetries,
      baseDelay
    ).catch(error => {
      logError(error, null, { context, args: args.length });
      throw error;
    });
  };
}

// Middleware de tratamento de erros global
function errorHandler(error, req, res, next) {
  logError(error, req);
  
  // Erros de validação
  if (error.code === 'VALIDATION_ERROR') {
    return res.status(400).json({
      error: error.message,
      code: error.code,
      correlationId: req.correlationId,
      details: error.details
    });
  }
  
  // Erros de autenticação
  if (error.code === 'UNAUTHORIZED') {
    return res.status(401).json({
      error: 'Não autorizado',
      code: 'UNAUTHORIZED',
      correlationId: req.correlationId
    });
  }
  
  // Erros de rate limiting
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    return res.status(429).json({
      error: error.message,
      code: error.code,
      correlationId: req.correlationId
    });
  }
  
  // Erros da OpenAI
  if (error.response?.data?.error) {
    const openAIError = error.response.data.error;
    return res.status(400).json({
      error: 'Erro na API de IA: ' + openAIError.message,
      code: 'AI_API_ERROR',
      correlationId: req.correlationId,
      details: { type: openAIError.type, code: openAIError.code }
    });
  }
  
  // Erros do WhatsApp Graph API
  if (error.response?.data?.error && error.response.config?.url?.includes('graph.facebook.com')) {
    const waError = error.response.data.error;
    return res.status(400).json({
      error: 'Erro na API do WhatsApp: ' + waError.message,
      code: 'WHATSAPP_API_ERROR',
      correlationId: req.correlationId,
      details: { 
        type: waError.type, 
        code: waError.code,
        fbtrace_id: waError.fbtrace_id 
      }
    });
  }
  
  // Erros de timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return res.status(408).json({
      error: 'Timeout na requisição. Tente novamente.',
      code: 'TIMEOUT_ERROR',
      correlationId: req.correlationId
    });
  }
  
  // Erros de conexão de rede
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Serviço temporariamente indisponível',
      code: 'SERVICE_UNAVAILABLE',
      correlationId: req.correlationId
    });
  }
  
  // Erro genérico - não expor detalhes internos
  res.status(500).json({
    error: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    correlationId: req.correlationId
  });
}

// Middleware para capturar erros assíncronos
function asyncHandler(fn) {
  return function(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  generateCorrelationId,
  addCorrelationId,
  logError,
  retryWithBackoff,
  shouldRetry,
  withRetry,
  errorHandler,
  asyncHandler
};
