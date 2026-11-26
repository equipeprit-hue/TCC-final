
// Importando as bibliotecas
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

// Criando a aplicação
const app = express();

// Configuração da porta
const PORT = process.env.PORT || 3000;

// Configurando os middlewares
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://equipeprit-hue.github.io'
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota inicial para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.status(200).json({
        sucesso: true,
        mensagem: 'Servidor da Kora está funcionando!'
    });
});

// Rota de contato
app.post(
    '/contato',

    // Validando o nome
    body('nome')
        .trim()
        .isLength({ min: 3 })
        .withMessage('O nome deve ter pelo menos 3 caracteres.'),

    // Validando o e-mail
    body('email')
        .trim()
        .isEmail()
        .withMessage('Informe um e-mail válido.'),

    // Validando o telefone
    body('telefone')
        .custom((value) => {
            const numeros = String(value || '').replace(/\D/g, '');
            return numeros.length === 10 || numeros.length === 11;
        })
        .withMessage('Informe um telefone válido com DDD.'),

    // Validando a atividade selecionada
    body('servico-interesse')
        .trim()
        .isIn([
            'caminhada',
            'corrida',
            'exercicios',
            'fortalecimento',
            'outro'
        ])
        .withMessage('Selecione uma atividade válida.'),

    // Validando a mensagem
    body('mensagem')
        .trim()
        .isLength({ min: 10, max: 500 })
        .withMessage('A mensagem deve ter entre 10 e 500 caracteres.'),

    // Processando os dados
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                sucesso: false,
                erros: errors.array()
            });
        }

        return res.status(200).json({
            sucesso: true,
            mensagem: 'Mensagem recebida com sucesso!'
        });
    }
);

// Rota para páginas não encontradas
app.use((req, res) => {
    res.status(404).json({
        sucesso: false,
        mensagem: 'Rota não encontrada.'
    });
});

// Inicializando o servidor
app.listen(PORT, () => {
    console.log(`Servidor Kora rodando na porta ${PORT}`);
});
