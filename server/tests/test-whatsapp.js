const axios = require('axios');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function testWhatsAppSend() {
  console.log('\n🔍 Testando envio via WhatsApp...');
  try {
    // Usar um número de teste do WhatsApp Business (deve estar no sandbox)
    // IMPORTANTE: Substitua pelo seu número de teste autorizado
    const testNumber = '5561986244500'; // Número autorizado no sandbox
    
    const response = await axios.post(`${BASE_URL}/api/send-message`, {
      to: testNumber,
      message: 'Teste de funcionamento do sistema',
      autoImprove: true,
      tone: 'profissional e cordial',
      language: 'pt-BR'
    });
    
    console.log('✅ Envio WhatsApp OK:');
    console.log('📝 Texto melhorado:', response.data.improvedText);
    console.log('📱 Resposta WhatsApp:', response.data.whatsapp);
    console.log('🔗 Correlation ID:', response.data.correlationId);
    return true;
  } catch (error) {
    console.error('❌ Envio WhatsApp falhou:', error.response?.data || error.message);
    console.log('💡 Nota: Verifique se o número está autorizado no sandbox do WhatsApp');
    return false;
  }
}

async function testWebhookReceive() {
  console.log('\n🔍 Testando webhook de recebimento...');
  try {
    // Simular um webhook do WhatsApp
    const webhookPayload = {
      entry: [{
        changes: [{
          value: {
            messages: [{
              id: 'test_message_id',
              from: '5561999999999',
              timestamp: Math.floor(Date.now() / 1000).toString(),
              type: 'text',
              text: { body: 'Olá, mensagem de teste' }
            }]
          }
        }]
      }]
    };

    const response = await axios.post(`${BASE_URL}/webhook`, webhookPayload);
    
    if (response.status === 200) {
      console.log('✅ Webhook recebimento OK');
      
      // Verificar se a mensagem foi salva no inbox
      const inboxResponse = await axios.get(`${BASE_URL}/api/inbox`);
      const hasNewMessage = inboxResponse.data.items.some(item => 
        item.phone === '5561999999999' && item.last_body === 'Olá, mensagem de teste'
      );
      
      if (hasNewMessage) {
        console.log('✅ Mensagem salva no inbox');
      } else {
        console.log('⚠️ Mensagem não encontrada no inbox');
      }
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Webhook recebimento falhou:', error.response?.data || error.message);
    return false;
  }
}

async function runWhatsAppTests() {
  console.log('🚀 Iniciando testes específicos do WhatsApp...');
  console.log(`📡 URL base: ${BASE_URL}`);
  console.log('⚠️  AVISO: O teste de envio só funcionará com números autorizados no sandbox');
  
  const results = [];
  results.push(await testWhatsAppSend());
  results.push(await testWebhookReceive());
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log('\n📊 Resultados dos testes WhatsApp:');
  console.log(`✅ Passou: ${passed}/${total}`);
  console.log(`❌ Falhou: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 Todos os testes WhatsApp passaram!');
  } else {
    console.log('⚠️  Alguns testes falharam. Para envio, verifique se o número está no sandbox.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runWhatsAppTests().catch(console.error);
}

module.exports = { runWhatsAppTests };
