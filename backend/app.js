// Aplicação Express principal
// Configura middlewares, rotas e integrações

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Configurações
const ambiente = require('./config/ambiente');
const banco = require('./config/banco');

// Middlewares
const autenticacao = require('./middleware/autenticacao');
const rateLimit = require('./middleware/rate-limit');

// Rotas
const rotasAuth = require('./api/auth');
const rotasUsuarios = require('./api/usuarios');
const rotasOrganizacoes = require('./api/organizacoes');
const rotasEventos = require('./api/eventos');
const rotasIngressos = require('./api/ingressos');
const rotasPedidos = require('./api/pedidos');
const rotasPagamentos = require('./api/pagamentos');
const rotasFinanceiro = require('./api/financeiro');
const rotasCheckin = require('./api/checkin');
const rotasNotificacoes = require('./api/notificacoes');
const rotasWhatsapp = require('./api/whatsapp');
const rotasEmail = require('./api/email');
const rotasAdmin = require('./api/admin');
const rotasRelatorios = require('./api/relatorios');

// Webhooks
const webhookMercadoPago = require('./webhooks/mercado-pago');
const webhookWhatsapp = require('./webhooks/whatsapp');
const webhookEmail = require('./webhooks/email');

// Inicializar Express
const app = express();

// Configurar trust proxy
app.set('trust proxy', 1);

// Middlewares globais
app.use(helmet());
app.use(cors(ambiente.CORS));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (ambiente.AMBIENTE === 'desenvolvimento') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting global
app.use('/api/', rateLimit.global);

// Servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// Rotas da API
app.use('/api/auth', rotasAuth);
app.use('/api/usuarios', autenticacao.validarToken, rotasUsuarios);
app.use('/api/organizacoes', autenticacao.validarToken, rotasOrganizacoes);
app.use('/api/eventos', rotasEventos);
app.use('/api/ingressos', rotasIngressos);
app.use('/api/pedidos', autenticacao.validarToken, rotasPedidos);
app.use('/api/pagamentos', rotasPagamentos);
app.use('/api/financeiro', autenticacao.validarToken, rotasFinanceiro);
app.use('/api/checkin', rotasCheckin);
app.use('/api/notificacoes', autenticacao.validarToken, rotasNotificacoes);
app.use('/api/whatsapp', rotasWhatsapp);
app.use('/api/email', rotasEmail);
app.use('/api/admin', autenticacao.validarToken, autenticacao.validarAdmin, rotasAdmin);
app.use('/api/relatorios', autenticacao.validarToken, rotasRelatorios);

// Webhooks (sem autenticação JWT)
app.use('/webhooks/mercado-pago', webhookMercadoPago);
app.use('/webhooks/whatsapp', webhookWhatsapp);
app.use('/webhooks/email', webhookEmail);

// Rota de saúde
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Rota de informações da API
app.get('/api/info', (req, res) => {
    res.status(200).json({
        nome: ambiente.NOME_APP,
        versao: ambiente.VERSAO,
        ambiente: ambiente.AMBIENTE
    });
});

// Tratamento de 404
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada'
    });
});

// Tratamento de erros
app.use((error, req, res, next) => {
    console.error('❌ Erro:', error);
    
    const statusCode = error.statusCode || 500;
    const mensagem = error.mensagem || 'Erro interno do servidor';
    
    res.status(statusCode).json({
        sucesso: false,
        mensagem: mensagem,
        ...(ambiente.AMBIENTE === 'desenvolvimento' && { stack: error.stack })
    });
});

// Conectar ao banco de dados
banco.conectar();

module.exports = app;
