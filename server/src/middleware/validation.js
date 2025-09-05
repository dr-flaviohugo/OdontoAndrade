// Validação de número de telefone E.164
function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Número de telefone é obrigatório' };
  }
  
  // Remove espaços e caracteres especiais
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Verifica formato E.164 (sem +, apenas dígitos)
  const e164Regex = /^[1-9]\d{1,14}$/;
  
  if (!e164Regex.test(cleaned)) {
    return { 
      valid: false, 
      error: 'Número deve estar no formato E.164 (ex: 5561999999999)' 
    };
  }
  
  return { valid: true, normalized: cleaned };
}

// Validação de texto
function validateText(text, options = {}) {
  const { 
    required = true, 
    minLength = 1, 
    maxLength = 4096,
    allowEmpty = false 
  } = options;
  
  if (!text && required && !allowEmpty) {
    return { valid: false, error: 'Texto é obrigatório' };
  }
  
  if (!text) {
    return { valid: true, normalized: '' };
  }
  
  if (typeof text !== 'string') {
    return { valid: false, error: 'Texto deve ser uma string' };
  }
  
  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    return { valid: false, error: `Texto deve ter pelo menos ${minLength} caracteres` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `Texto deve ter no máximo ${maxLength} caracteres` };
  }
  
  return { valid: true, normalized: trimmed };
}

// Validação de tom
function validateTone(tone) {
  const validTones = [
    'profissional e cordial',
    'amigável', 
    'objetivo',
    'formal',
    'casual'
  ];
  
  if (!tone) {
    return { valid: true, normalized: 'profissional e cordial' };
  }
  
  if (typeof tone !== 'string') {
    return { valid: false, error: 'Tom deve ser uma string' };
  }
  
  const normalized = tone.toLowerCase().trim();
  
  if (!validTones.includes(normalized)) {
    return { 
      valid: false, 
      error: `Tom deve ser um dos seguintes: ${validTones.join(', ')}` 
    };
  }
  
  return { valid: true, normalized };
}

// Validação de idioma
function validateLanguage(language) {
  const validLanguages = ['pt-BR', 'en-US', 'es-ES'];
  
  if (!language) {
    return { valid: true, normalized: 'pt-BR' };
  }
  
  if (typeof language !== 'string') {
    return { valid: false, error: 'Idioma deve ser uma string' };
  }
  
  if (!validLanguages.includes(language)) {
    return { 
      valid: false, 
      error: `Idioma deve ser um dos seguintes: ${validLanguages.join(', ')}` 
    };
  }
  
  return { valid: true, normalized: language };
}

// Middleware de validação para improve-text
function validateImproveTextRequest(req, res, next) {
  const { text, tone, language } = req.body || {};
  const errors = [];
  
  // Validar texto
  const textValidation = validateText(text, { required: true, maxLength: 2000 });
  if (!textValidation.valid) {
    errors.push({ field: 'text', message: textValidation.error });
  } else {
    req.body.text = textValidation.normalized;
  }
  
  // Validar tom
  const toneValidation = validateTone(tone);
  if (!toneValidation.valid) {
    errors.push({ field: 'tone', message: toneValidation.error });
  } else {
    req.body.tone = toneValidation.normalized;
  }
  
  // Validar idioma
  const languageValidation = validateLanguage(language);
  if (!languageValidation.valid) {
    errors.push({ field: 'language', message: languageValidation.error });
  } else {
    req.body.language = languageValidation.normalized;
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      code: 'VALIDATION_ERROR',
      details: errors
    });
  }
  
  next();
}

// Middleware de validação para send-message
function validateSendMessageRequest(req, res, next) {
  const { to, message, tone, language, autoImprove } = req.body || {};
  const errors = [];
  
  // Validar destinatário
  const phoneValidation = validatePhoneNumber(to);
  if (!phoneValidation.valid) {
    errors.push({ field: 'to', message: phoneValidation.error });
  } else {
    req.body.to = phoneValidation.normalized;
  }
  
  // Validar mensagem
  const messageValidation = validateText(message, { 
    required: true, 
    maxLength: 4096 
  });
  if (!messageValidation.valid) {
    errors.push({ field: 'message', message: messageValidation.error });
  } else {
    req.body.message = messageValidation.normalized;
  }
  
  // Validar tom
  const toneValidation = validateTone(tone);
  if (!toneValidation.valid) {
    errors.push({ field: 'tone', message: toneValidation.error });
  } else {
    req.body.tone = toneValidation.normalized;
  }
  
  // Validar idioma
  const languageValidation = validateLanguage(language);
  if (!languageValidation.valid) {
    errors.push({ field: 'language', message: languageValidation.error });
  } else {
    req.body.language = languageValidation.normalized;
  }
  
  // Validar autoImprove
  if (autoImprove !== undefined && typeof autoImprove !== 'boolean') {
    errors.push({ field: 'autoImprove', message: 'autoImprove deve ser um boolean' });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Dados de entrada inválidos',
      code: 'VALIDATION_ERROR',
      details: errors
    });
  }
  
  next();
}

// Middleware de validação para mensagens endpoint
function validateMessagesRequest(req, res, next) {
  const { phone } = req.query;
  const errors = [];
  
  if (!phone) {
    errors.push({ field: 'phone', message: 'Parâmetro phone é obrigatório' });
  } else {
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.valid) {
      errors.push({ field: 'phone', message: phoneValidation.error });
    } else {
      req.query.phone = phoneValidation.normalized;
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Parâmetros inválidos',
      code: 'VALIDATION_ERROR', 
      details: errors
    });
  }
  
  next();
}

module.exports = {
  validatePhoneNumber,
  validateText,
  validateTone,
  validateLanguage,
  validateImproveTextRequest,
  validateSendMessageRequest,
  validateMessagesRequest
};
