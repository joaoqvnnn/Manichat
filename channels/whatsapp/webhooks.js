// Webhook do WhatsApp
// Este arquivo processa os eventos recebidos do WhatsApp

const express = require('express');
const router = express.Router();

// Configuração do Webhook
const WHATSAPP_WEBHOOK_SECRET = process.env.WHATSAPP_WEBHOOK_SECRET || '';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';

// Endpoint de verificação (GET)
router.get('/webhook/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === WHATSAPP_WEBHOOK_SECRET) {
            console.log('Webhook WhatsApp verificado com sucesso');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

// Endpoint de eventos (POST)
router.post('/webhook/whatsapp', async (req, res) => {
    try {
        const { body } = req;
        
        // Verificar se é um evento do WhatsApp
        if (body.object === 'whatsapp_business_account') {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    if (change.field === 'messages') {
                        await handleMessage(change.value);
                    }
                    
                    if (change.field === 'message_template_status_update') {
                        await handleTemplateStatus(change.value);
                    }
                }
            }
            
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Erro no webhook do WhatsApp:', error);
        res.sendStatus(500);
    }
});

// Processar mensagens recebidas
async function handleMessage(value) {
    try {
        const { messages, contacts, metadata } = value;
        
        if (messages && messages.length > 0) {
            for (const message of messages) {
                const from = message.from;
                const contact = contacts?.find(c => c.wa_id === from);
                
                // Processar diferentes tipos de mensagem
                switch (message.type) {
                    case 'text':
                        await handleTextMessage(from, message.text.body, contact);
                        break;
                        
                    case 'image':
                        await handleImageMessage(from, message.image, contact);
                        break;
                        
                    case 'audio':
                        await handleAudioMessage(from, message.audio, contact);
                        break;
                        
                    case 'video':
                        await handleVideoMessage(from, message.video, contact);
                        break;
                        
                    case 'document':
                        await handleDocumentMessage(from, message.document, contact);
                        break;
                        
                    case 'location':
                        await handleLocationMessage(from, message.location, contact);
                        break;
                        
                    case 'button':
                        await handleButtonResponse(from, message.button, contact);
                        break;
                        
                    case 'interactive':
                        await handleInteractiveResponse(from, message.interactive, contact);
                        break;
                        
                    default:
                        console.log(`Tipo de mensagem não suportado: ${message.type}`);
                }
            }
        }
        
        // Processar status de mensagem
        if (value.statuses) {
            for (const status of value.statuses) {
                await handleMessageStatus(status);
            }
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
}

// Processar mensagem de texto
async function handleTextMessage(from, text, contact) {
    console.log(`Mensagem de texto de ${from}: ${text}`);
    console.log('Contato:', contact);
    
    // Aqui você pode:
    // 1. Buscar o contato no banco de dados
    // 2. Verificar se há automação ativa
    // 3. Processar a mensagem no fluxo
    // 4. Enviar resposta automática
}

// Processar mensagem de imagem
async function handleImageMessage(from, image, contact) {
    console.log(`Imagem de ${from}:`, image);
    
    // Processar imagem recebida
}

// Processar mensagem de áudio
async function handleAudioMessage(from, audio, contact) {
    console.log(`Áudio de ${from}:`, audio);
    
    // Processar áudio recebido
}

// Processar mensagem de vídeo
async function handleVideoMessage(from, video, contact) {
    console.log(`Vídeo de ${from}:`, video);
    
    // Processar vídeo recebido
}

// Processar mensagem de documento
async function handleDocumentMessage(from, document, contact) {
    console.log(`Documento de ${from}:`, document);
    
    // Processar documento recebido
}

// Processar mensagem de localização
async function handleLocationMessage(from, location, contact) {
    console.log(`Localização de ${from}:`, location);
    
    // Processar localização recebida
}

// Processar resposta de botão
async function handleButtonResponse(from, button, contact) {
    console.log(`Botão de ${from}:`, button);
    
    // Processar resposta de botão
}

// Processar resposta interativa
async function handleInteractiveResponse(from, interactive, contact) {
    console.log(`Resposta interativa de ${from}:`, interactive);
    
    // Processar resposta interativa
}

// Processar status de mensagem
async function handleMessageStatus(status) {
    console.log('Status da mensagem:', status);
    
    const statusMap = {
        'sent': 'Enviada',
        'delivered': 'Entregue',
        'read': 'Lida',
        'failed': 'Falhou'
    };
    
    console.log(`Mensagem ${status.id}: ${statusMap[status.status] || status.status}`);
}

// Processar atualização de status do template
async function handleTemplateStatus(value) {
    console.log('Status do template:', value);
    
    // Aqui você pode atualizar o status do template no banco de dados
}

module.exports = router;
