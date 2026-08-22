// Servidor principal da aplicação
// Responsável por iniciar o servidor HTTP/HTTPS

const app = require('./app');
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuração do ambiente
const ambiente = require('./config/ambiente');

// Porta do servidor
const PORT = process.env.PORT || ambiente.PORTA || 3000;

// Criar servidor HTTP
const server = http.createServer(app);

// Configurar HTTPS se certificados estiverem disponíveis
let serverFinal = server;

try {
    const certPath = path.join(__dirname, 'certificados');
    const privateKey = fs.readFileSync(path.join(certPath, 'privkey.pem'));
    const certificate = fs.readFileSync(path.join(certPath, 'cert.pem'));
    const ca = fs.readFileSync(path.join(certPath, 'chain.pem'));
    
    const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    };
    
    const httpsServer = https.createServer(credentials, app);
    serverFinal = httpsServer;
    console.log('🔒 HTTPS habilitado');
} catch (error) {
    console.log('ℹ️ HTTPS não configurado, usando HTTP');
}

// Iniciar servidor
serverFinal.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 Servidor iniciado com sucesso!');
    console.log(`📡 Porta: ${PORT}`);
    console.log(`🌐 Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
    console.log(`📅 Data: ${new Date().toISOString()}`);
    console.log('========================================');
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
    process.exit(1);
});

// Tratamento de promessas rejeitadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promessa rejeitada:', reason);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Recebido SIGTERM, encerrando servidor...');
    serverFinal.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Recebido SIGINT, encerrando servidor...');
    serverFinal.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});

module.exports = serverFinal;
