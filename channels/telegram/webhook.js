// Webhook do Telegram
// Este arquivo processa os eventos recebidos do Telegram

const express = require('express');
const router = express.Router();

// Configuração do Webhook
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';

// Endpoint principal do webhook (POST)
router.post('/webhook/telegram', async (req, res) => {
    try {
        const { body } = req;
        
        // Verificar se é uma atualização válida do Telegram
        if (body.update_id && (body.message || body.callback_query || body.edited_message)) {
            await processUpdate(body);
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error('Erro no webhook do Telegram:', error);
        res.sendStatus(500);
    }
});

// Endpoint de verificação (GET) - opcional para segurança
router.get('/webhook/telegram', (req, res) => {
    const secret = req.query.secret;
    
    if (secret === TELEGRAM_WEBHOOK_SECRET) {
        res.status(200).json({ status: 'ok' });
    } else {
        res.sendStatus(403);
    }
});

// Processar atualização recebida
async function processUpdate(update) {
    try {
        // Processar mensagens
        if (update.message) {
            await handleMessage(update.message);
        }
        
        // Processar mensagens editadas
        if (update.edited_message) {
            await handleEditedMessage(update.edited_message);
        }
        
        // Processar callback queries (botões inline)
        if (update.callback_query) {
            await handleCallbackQuery(update.callback_query);
        }
        
        // Processar channel posts
        if (update.channel_post) {
            await handleChannelPost(update.channel_post);
        }
    } catch (error) {
        console.error('Erro ao processar atualização:', error);
    }
}

// Processar mensagem recebida
async function handleMessage(message) {
    try {
        const chatId = message.chat.id;
        const from = message.from;
        
        // Processar diferentes tipos de mensagem
        switch (true) {
            case !!message.text:
                await handleTextMessage(chatId, from, message.text);
                break;
                
            case !!message.photo:
                await handlePhotoMessage(chatId, from, message.photo);
                break;
                
            case !!message.video:
                await handleVideoMessage(chatId, from, message.video);
                break;
                
            case !!message.audio:
                await handleAudioMessage(chatId, from, message.audio);
                break;
                
            case !!message.document:
                await handleDocumentMessage(chatId, from, message.document);
                break;
                
            case !!message.location:
                await handleLocationMessage(chatId, from, message.location);
                break;
                
            case !!message.contact:
                await handleContactMessage(chatId, from, message.contact);
                break;
                
            case !!message.sticker:
                await handleStickerMessage(chatId, from, message.sticker);
                break;
                
            default:
                console.log(`Tipo de mensagem não processado de ${chatId}`);
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
}

// Processar mensagem de texto
async function handleTextMessage(chatId, from, text) {
    console.log(`Mensagem de texto de ${from.username || from.first_name} (${chatId}): ${text}`);
    
    // Verificar se é um comando
    if (text.startsWith('/')) {
        await handleCommand(chatId, from, text);
        return;
    }
    
    // Aqui você pode:
    // 1. Buscar o contato no banco de dados
    // 2. Verificar se há automação ativa
    // 3. Processar a mensagem no fluxo
    // 4. Enviar resposta automática
}

// Processar comando
async function handleCommand(chatId, from, command) {
    const commandMap = {
        '/start': handleStartCommand,
        '/help': handleHelpCommand,
        '/menu': handleMenuCommand
    };
    
    const handler = commandMap[command];
    
    if (handler) {
        await handler(chatId, from);
    } else {
        console.log(`Comando não reconhecido: ${command}`);
    }
}

// Comando /start
async function handleStartCommand(chatId, from) {
    console.log(`Comando /start de ${chatId}`);
    // Enviar mensagem de boas-vindas
}

// Comando /help
async function handleHelpCommand(chatId, from) {
    console.log(`Comando /help de ${chatId}`);
    // Enviar mensagem de ajuda
}

// Comando /menu
async function handleMenuCommand(chatId, from) {
    console.log(`Comando /menu de ${chatId}`);
    // Enviar menu principal
}

// Processar mensagem de foto
async function handlePhotoMessage(chatId, from, photo) {
    console.log(`Foto de ${chatId}:`, photo);
    // Processar foto recebida
}

// Processar mensagem de vídeo
async function handleVideoMessage(chatId, from, video) {
    console.log(`Vídeo de ${chatId}:`, video);
    // Processar vídeo recebido
}

// Processar mensagem de áudio
async function handleAudioMessage(chatId, from, audio) {
    console.log(`Áudio de ${chatId}:`, audio);
    // Processar áudio recebido
}

// Processar mensagem de documento
async function handleDocumentMessage(chatId, from, document) {
    console.log(`Documento de ${chatId}:`, document);
    // Processar documento recebido
}

// Processar mensagem de localização
async function handleLocationMessage(chatId, from, location) {
    console.log(`Localização de ${chatId}:`, location);
    // Processar localização recebida
}

// Processar mensagem de contato
async function handleContactMessage(chatId, from, contact) {
    console.log(`Contato de ${chatId}:`, contact);
    // Processar contato recebido
}

// Processar mensagem de sticker
async function handleStickerMessage(chatId, from, sticker) {
    console.log(`Sticker de ${chatId}:`, sticker);
    // Processar sticker recebido
}

// Processar mensagem editada
async function handleEditedMessage(message) {
    console.log('Mensagem editada:', message);
    // Processar mensagem editada
}

// Processar callback query (botões inline)
async function handleCallbackQuery(callbackQuery) {
    try {
        const { id, data, message } = callbackQuery;
        console.log(`Callback query ${id}: ${data}`);
        
        // Responder ao callback
        await answerCallbackQuery(id);
        
        // Processar dados do callback
        // Ex: "botao:1", "menu:principal", etc.
        if (data) {
            await processCallbackData(data, message);
        }
    } catch (error) {
        console.error('Erro ao processar callback query:', error);
    }
}

// Responder callback query
async function answerCallbackQuery(callbackQueryId) {
    // Enviar resposta ao callback
    console.log(`Respondendo callback ${callbackQueryId}`);
}

// Processar dados do callback
async function processCallbackData(data, message) {
    console.log(`Processando callback: ${data}`);
    
    // Aqui você pode processar diferentes ações
    // baseadas nos dados recebidos do botão
}

// Processar channel post
async function handleChannelPost(post) {
    console.log('Channel post:', post);
    // Processar post de canal
}

// Função para enviar mensagem (exemplo)
async function sendMessage(chatId, text, options = {}) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                ...options
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        throw error;
    }
}

// Função para enviar foto (exemplo)
async function sendPhoto(chatId, photo, caption = '') {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                photo: photo,
                caption: caption
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao enviar foto:', error);
        throw error;
    }
}

// Função para enviar teclado personalizado (exemplo)
async function sendKeyboard(chatId, text, keyboard) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                reply_markup: {
                    keyboard: keyboard,
                    resize_keyboard: true
                }
            })
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao enviar teclado:', error);
        throw error;
    }
}

module.exports = router;
