// Webhook do Messenger
// Este arquivo processa os eventos recebidos do Messenger

const express = require('express');
const router = express.Router();

// Configuração do Webhook
const MESSENGER_VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN || '';
const MESSENGER_PAGE_TOKEN = process.env.MESSENGER_PAGE_TOKEN || '';

// Endpoint de verificação (GET)
router.get('/webhook/messenger', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === MESSENGER_VERIFY_TOKEN) {
            console.log('Webhook Messenger verificado com sucesso');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

// Endpoint de eventos (POST)
router.post('/webhook/messenger', async (req, res) => {
    try {
        const { body } = req;
        
        // Verificar se é um evento do Messenger
        if (body.object === 'page') {
            for (const entry of body.entry) {
                // Processar mensagens
                if (entry.messaging) {
                    for (const event of entry.messaging) {
                        await processMessagingEvent(event);
                    }
                }
                
                // Processar mudanças
                if (entry.changes) {
                    for (const change of entry.changes) {
                        await processChange(change);
                    }
                }
            }
            
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Erro no webhook do Messenger:', error);
        res.sendStatus(500);
    }
});

// Processar eventos de mensagens
async function processMessagingEvent(event) {
    try {
        const senderId = event.sender.id;
        const recipientId = event.recipient.id;
        
        // Processar mensagens
        if (event.message) {
            await handleMessage(senderId, recipientId, event.message);
        }
        
        // Processar postbacks (botões)
        if (event.postback) {
            await handlePostback(senderId, recipientId, event.postback);
        }
        
        // Processar entregas
        if (event.delivery) {
            await handleDelivery(event.delivery);
        }
        
        // Processar leituras
        if (event.read) {
            await handleRead(event.read);
        }
        
        // Processar reações
        if (event.reaction) {
            await handleReaction(senderId, event.reaction);
        }
    } catch (error) {
        console.error('Erro ao processar evento de mensagem:', error);
    }
}

// Processar mensagem recebida
async function handleMessage(senderId, recipientId, message) {
    try {
        // Verificar tipo de mensagem
        if (message.text) {
            await handleTextMessage(senderId, recipientId, message.text, message.quick_reply);
        }
        
        if (message.attachments) {
            for (const attachment of message.attachments) {
                await handleAttachment(senderId, recipientId, attachment);
            }
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
}

// Processar mensagem de texto
async function handleTextMessage(senderId, recipientId, text, quickReply) {
    console.log(`Mensagem de texto de ${senderId}: ${text}`);
    
    // Verificar se é resposta rápida
    if (quickReply) {
        console.log('Resposta rápida:', quickReply.payload);
        await handleQuickReply(senderId, quickReply.payload);
        return;
    }
    
    // Aqui você pode:
    // 1. Buscar o contato no banco de dados
    // 2. Verificar se há automação ativa
    // 3. Processar a mensagem no fluxo
    // 4. Enviar resposta automática
}

// Processar resposta rápida
async function handleQuickReply(senderId, payload) {
    console.log(`Processando resposta rápida de ${senderId}: ${payload}`);
    
    // Processar o payload da resposta rápida
}

// Processar anexos
async function handleAttachment(senderId, recipientId, attachment) {
    console.log(`Anexo de ${senderId}:`, attachment);
    
    switch (attachment.type) {
        case 'image':
            await handleImageAttachment(senderId, attachment.payload.url);
            break;
            
        case 'video':
            await handleVideoAttachment(senderId, attachment.payload.url);
            break;
            
        case 'audio':
            await handleAudioAttachment(senderId, attachment.payload.url);
            break;
            
        case 'file':
            await handleFileAttachment(senderId, attachment.payload.url);
            break;
            
        case 'location':
            await handleLocationAttachment(senderId, attachment.payload.coordinates);
            break;
            
        case 'fallback':
            console.log('Anexo fallback recebido');
            break;
            
        default:
            console.log(`Tipo de anexo não processado: ${attachment.type}`);
    }
}

// Processar anexo de imagem
async function handleImageAttachment(senderId, url) {
    console.log(`Imagem de ${senderId}: ${url}`);
    // Processar imagem recebida
}

// Processar anexo de vídeo
async function handleVideoAttachment(senderId, url) {
    console.log(`Vídeo de ${senderId}: ${url}`);
    // Processar vídeo recebido
}

// Processar anexo de áudio
async function handleAudioAttachment(senderId, url) {
    console.log(`Áudio de ${senderId}: ${url}`);
    // Processar áudio recebido
}

// Processar anexo de arquivo
async function handleFileAttachment(senderId, url) {
    console.log(`Arquivo de ${senderId}: ${url}`);
    // Processar arquivo recebido
}

// Processar anexo de localização
async function handleLocationAttachment(senderId, coordinates) {
    console.log(`Localização de ${senderId}:`, coordinates);
    // Processar localização recebida
}

// Processar postback (botões)
async function handlePostback(senderId, recipientId, postback) {
    console.log(`Postback de ${senderId}:`, postback);
    
    const { title, payload } = postback;
    
    // Processar diferentes payloads
    // Ex: "menu:principal", "confirmar:sim", etc.
    await processPayload(senderId, payload);
}

// Processar payload
async function processPayload(senderId, payload) {
    console.log(`Processando payload de ${senderId}: ${payload}`);
    
    // Aqui você pode processar diferentes ações
    // baseadas no payload recebido
}

// Processar entrega
async function handleDelivery(delivery) {
    console.log('Entrega:', delivery);
    // Processar confirmação de entrega
}

// Processar leitura
async function handleRead(read) {
    console.log('Leitura:', read);
    // Processar confirmação de leitura
}

// Processar reação
async function handleReaction(senderId, reaction) {
    console.log(`Reação de ${senderId}:`, reaction);
    // Processar reação à mensagem
}

// Processar mudanças
async function processChange(change) {
    console.log('Mudança:', change);
    
    // Processar diferentes tipos de mudanças
    if (change.field === 'feed') {
        // Mudança no feed
    }
}

// Função para enviar mensagem de texto
async function sendTextMessage(recipientId, text) {
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MESSENGER_PAGE_TOKEN}`
            },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: { text: text }
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
    }
}

// Função para enviar resposta rápida
async function sendQuickReplies(recipientId, text, replies) {
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MESSENGER_PAGE_TOKEN}`
            },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: {
                    text: text,
                    quick_replies: replies
                }
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao enviar respostas rápidas:', error);
        throw error;
    }
}

// Função para enviar botões
async function sendButtons(recipientId, text, buttons) {
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MESSENGER_PAGE_TOKEN}`
            },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: {
                    attachment: {
                        type: 'template',
                        payload: {
                            template_type: 'button',
                            text: text,
                            buttons: buttons
                        }
                    }
                }
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao enviar botões:', error);
        throw error;
    }
}

// Função para enviar imagem
async function sendImage(recipientId, imageUrl) {
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/me/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MESSENGER_PAGE_TOKEN}`
            },
            body: JSON.stringify({
                recipient: { id: recipientId },
                message: {
                    attachment: {
                        type: 'image',
                        payload: { url: imageUrl }
                    }
                }
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        throw error;
    }
}

// Função para configurar menu persistente
async function setPersistentMenu(menuItems) {
    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/me/messenger_profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MESSENGER_PAGE_TOKEN}`
            },
            body: JSON.stringify({
                persistent_menu: menuItems
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao configurar menu persistente:', error);
        throw error;
    }
}

module.exports = router;
