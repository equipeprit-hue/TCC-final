
// Importando as bibliotecas
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');

// Criando a aplicação
const app = express();

// Configurando os middlewares
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Criando a rota de contato e suas validações
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

    // Processando os dados recebidos
    (req, res) => {

        // Verificando os resultados das validações
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                sucesso: false,
                erros: errors.array()
            });
        }

        // Retornando resposta de sucesso
        return res.status(200).json({
            sucesso: true,
            mensagem: 'Mensagem recebida com sucesso!'
        });
    }
);

// Inicializando o servidor
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor Kora rodando em http://localhost:${PORT}`);
});
