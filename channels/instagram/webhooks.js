// Webhook do Instagram
// Este arquivo processa os eventos recebidos do Instagram

const express = require('express');
const router = express.Router();

// Configuração do Webhook
const INSTAGRAM_WEBHOOK_SECRET = process.env.INSTAGRAM_WEBHOOK_SECRET || '';

// Endpoint de verificação (GET)
router.get('/webhook/instagram', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === INSTAGRAM_WEBHOOK_SECRET) {
            console.log('Webhook Instagram verificado com sucesso');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

// Endpoint de eventos (POST)
router.post('/webhook/instagram', async (req, res) => {
    try {
        const { body } = req;
        
        // Verificar se é um evento do Instagram
        if (body.object === 'instagram') {
            for (const entry of body.entry) {
                // Processar mensagens
                if (entry.messaging) {
                    for (const event of entry.messaging) {
                        await handleMessage(event);
                    }
                }
                
                // Processar comentários
                if (entry.changes) {
                    for (const change of entry.changes) {
                        if (change.field === 'comments') {
                            await handleComment(change.value);
                        }
                    }
                }
            }
            
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error('Erro no webhook do Instagram:', error);
        res.sendStatus(500);
    }
});

// Processar mensagens recebidas
async function handleMessage(event) {
    try {
        const senderId = event.sender.id;
        const message = event.message;
        
        // Verificar tipo de mensagem
        if (message.text) {
            console.log(`Mensagem de ${senderId}: ${message.text}`);
            
            // Aqui você pode processar a mensagem
            // e enviar para o fluxo de automação
        }
        
        if (message.attachments) {
            console.log(`Anexo de ${senderId}:`, message.attachments);
        }
    } catch (error) {
        console.error('Erro ao processar mensagem:', error);
    }
}

// Processar comentários
async function handleComment(comment) {
    try {
        console.log('Novo comentário:', comment);
        
        // Aqui você pode processar o comentário
        // e acionar respostas automáticas
    } catch (error) {
        console.error('Erro ao processar comentário:', error);
    }
}

module.exports = router;
