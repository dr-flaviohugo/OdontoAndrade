const axios = require('axios');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testHealthCheck() {
  console.log('\n🔍 Testando Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log('✅ Health Check OK:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health Check falhou:', error.message);
    return false;
  }
}

async function testImproveText() {
  console.log('\n🔍 Testando melhoria de texto...');
  try {
    const response = await axios.post(`${BASE_URL}/api/improve-text`, {
      text: 'oi tudo bem? queria marcar uma consulta',
      tone: 'profissional e cordial',
      language: 'pt-BR'
    });
    console.log('✅ Melhoria de texto OK:', response.data.improvedText);
    return true;
  } catch (error) {
    console.error('❌ Melhoria de texto falhou:', error.response?.data || error.message);
    return false;
  }
}

async function testWebhookVerification() {
  console.log('\n🔍 Testando verificação do webhook...');
  try {
    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || 'test_token';
    const challenge = 'test_challenge_123';
    const response = await axios.get(`${BASE_URL}/webhook`, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': verifyToken,
        'hub.challenge': challenge
      }
    });
    
    if (response.data === challenge) {
      console.log('✅ Webhook verification OK');
      return true;
    } else {
      console.error('❌ Webhook verification falhou: challenge não retornado');
      return false;
    }
  } catch (error) {
    console.error('❌ Webhook verification falhou:', error.response?.status, error.response?.data || error.message);
    return false;
  }
}

async function testInboxEndpoint() {
  console.log('\n🔍 Testando endpoint de inbox...');
  try {
    const response = await axios.get(`${BASE_URL}/api/inbox`);
    console.log('✅ Inbox OK:', `${response.data.items.length} conversas encontradas`);
    return true;
  } catch (error) {
    console.error('❌ Inbox falhou:', error.response?.data || error.message);
    return false;
  }
}

async function testMessagesEndpoint() {
  console.log('\n🔍 Testando endpoint de mensagens...');
  try {
    const response = await axios.get(`${BASE_URL}/api/messages?phone=5561999999999`);
    console.log('✅ Messages OK:', `${response.data.items.length} mensagens encontradas`);
    return true;
  } catch (error) {
    console.error('❌ Messages falhou:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Iniciando testes dos endpoints...');
  console.log(`📡 URL base: ${BASE_URL}`);
  
  const results = [];
  results.push(await testHealthCheck());
  results.push(await testImproveText());
  results.push(await testWebhookVerification());
  results.push(await testInboxEndpoint());
  results.push(await testMessagesEndpoint());
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log('\n📊 Resultados dos testes:');
  console.log(`✅ Passou: ${passed}/${total}`);
  console.log(`❌ Falhou: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 Todos os testes passaram!');
  } else {
    console.log('⚠️  Alguns testes falharam. Verifique as configurações.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testHealthCheck, testImproveText, testWebhookVerification, testInboxEndpoint, testMessagesEndpoint };
