/* ==========================================================================
   ARTE & MADEIRA MARCENARIA - JAVASCRIPT DIDÁTICO
   ========================================================================== */

/* Espera todo o documento HTML carregar completamente na memória antes de rodar o código */
document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. MAPEAMENTO DOS ELEMENTOS DO DOM (SELEÇÃO DE COMPONENTES DA TELA)
       ---------------------------------------------------------------------- */
    
    /* Captura a tag do formulário de contato pelo seu ID */
    const contactForm = document.getElementById('contact-form');
    
    /* Captura a caixa de texto onde o usuário digita o Nome */
    const inputNome = document.getElementById('nome');
    
    /* Captura a caixa de texto onde o usuário digita o E-mail */
    const inputEmail = document.getElementById('email');
    
    /* Captura a caixa de texto onde o usuário digita o Telefone */
    const inputTelefone = document.getElementById('telefone');
    
    /* Captura o menu suspenso de seleção de Serviços */
    const selectServico = document.getElementById('servico-interesse');
    
    /* Captura a caixa de texto grande onde o usuário digita a Mensagem */
    const textareaMensagem = document.getElementById('mensagem');
    
    /* Captura a caixa que exibirá o aviso de Sucesso ou Erro geral do formulário */
    const formFeedback = document.getElementById('form-feedback');
    
    /* Captura todos os links do menu principal e botões de navegação SPA */
    const allNavElements = document.querySelectorAll('.nav-link, .js-spa-nav');
    
    /* Captura todas as seções das páginas do sistema SPA (Início, Serviços, Sobre, Contato) */
    const spaSections = document.querySelectorAll('.spa-section');
    
    /* Captura o botão invisível de acessibilidade 'Pular para o conteúdo principal' */
    const skipLink = document.querySelector('.skip-link');
    
    /* Captura a tag principal do conteúdo do site (<main>) */
    const mainContent = document.getElementById('main-content');


    /* ----------------------------------------------------------------------
       2. NAVEGAÇÃO SPA (SINGLE PAGE APPLICATION)
       ---------------------------------------------------------------------- */

    /**
     * Função responsável por alternar a página visível na tela sem recarregar o navegador
     * @param {string} targetId - O ID da seção que deve ser mostrada (ex: 'home', 'servicos')
     */
    function switchPage(targetId) {
        if (!targetId) return;

        /* Percorre cada uma das 4 seções do site uma a uma */
        spaSections.forEach(section => {
            /* Verifica se o ID da seção atual é igual ao ID da página que o usuário quer ver */
            if (section.id === targetId) {
                /* Se for a página certa, adiciona a classe CSS que deixa a seção visível */
                section.classList.add('active-section');
                /* Remove o atributo 'hidden' para permitir que a seção apareça na tela */
                section.removeAttribute('hidden');
            } else {
                /* Se não for a página certa, remove a classe de exibição */
                section.classList.remove('active-section');
                /* Adiciona o atributo 'hidden' para esconder a seção de leitores de tela e do visual */
                section.setAttribute('hidden', '');
            }
        });

        /* Percorre todos os links de navegação para atualizar o destaque visual do menu ativo */
        allNavElements.forEach(item => {
            if (item.classList.contains('nav-link')) {
                if (item.getAttribute('data-target') === targetId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            }
        });

        /* Faz a tela rolar suavemente de volta para o topo da página ao trocar de seção */
       requestAnimationFrame(() => {
			window.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		});
    }

    /* Adiciona o evento de clique em todos os links e botões de navegação */
    allNavElements.forEach(element => {
        element.addEventListener('click', (e) => {
            /* Evita que o navegador tente recarregar a página ou navegar pela âncora padrão */
            e.preventDefault();
            /* Pega o ID da seção de destino gravada no atributo data-target */
            const target = element.getAttribute('data-target');
            /* Executa a troca de página */
            switchPage(target);
        });
    });


    /* ----------------------------------------------------------------------
       3. CORREÇÃO DO SKIP LINK (ACESSIBILIDADE SEM TELA VAZIA)
       ---------------------------------------------------------------------- */
    
    /* Verifica se o link de salto existe na página */
    if (skipLink) {
        /* Escuta o clique no link de salto (acionado ao apertar TAB e ENTER) */
        skipLink.addEventListener('click', (e) => {
            /* Cancela o comportamento padrão da âncora do HTML que gerava a tela vazia */
            e.preventDefault();
            
            /* Verifica se a tag <main> existe na tela */
            if (mainContent) {
                /* Direciona o foco do teclado direto para dentro do conteúdo principal */
                mainContent.focus();
                /* Rola a tela suavemente para garantir que o usuário veja o conteúdo */
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }


    /* ----------------------------------------------------------------------
       4. MÁSCARA E FORMATAÇÃO DE TELEFONE EM TEMPO REAL
       ---------------------------------------------------------------------- */

    /* Verifica se o campo de telefone existe no formulário */
    if (inputTelefone) {
        /* Monitora cada tecla digitada pelo usuário no campo de telefone */
        inputTelefone.addEventListener('input', (e) => {
            /* Remove tudo o que NÃO for número usando Expressão Regular (Regex) */
            let value = e.target.value.replace(/\D/g, '');
            
            /* Limita a quantidade máxima a 11 dígitos (DDD + 9 números) */
            value = value.substring(0, 11);

            /* Aplica a formatação do DDD ex: (11) */
            if (value.length > 2) {
                value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
            }
            /* Aplica o hífen no formato de celular de 9 dígitos ex: (11) 99999-9999 */
            if (value.length > 9) {
                value = `${value.substring(0, 10)}-${value.substring(10)}`;
            }

            /* Atualiza o campo na tela com o valor formatado bonitinho */
            e.target.value = value;
        });
    }


    /* ----------------------------------------------------------------------
       5. REGRAS DE VALIDAÇÃO DOS CAMPOS DO FORMULÁRIO
       ---------------------------------------------------------------------- */

    /**
     * Exibe a mensagem de erro abaixo do campo e aplica a borda vermelha
     * @param {HTMLElement} input - O campo do formulário que contém o erro
     * @param {string} message - A mensagem de erro explicativa que será exibida
     */
    function showError(input, message) {
        /* Procura o elemento <span> reservado para a mensagem de erro deste campo */
        const errorSpan = document.getElementById(`error-${input.id}`);
        /* Adiciona a classe que pinta a borda do campo de vermelho */
        input.classList.add('is-invalid');
        /* Adiciona a mensagem de erro dentro do <span> */
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    /**
     * Limpa o erro do campo, removendo a borda vermelha e o texto explicativo
     * @param {HTMLElement} input - O campo que será limpo
     */
    function clearError(input) {
        /* Localiza o <span> de erro correspondente ao campo */
        const errorSpan = document.getElementById(`error-${input.id}`);
        /* Remove a classe de borda vermelha */
        input.classList.remove('is-invalid');
        /* Limpa o texto da mensagem de erro */
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    }

    /**
     * Valida o campo Nome Completo
     * @returns {boolean} Retorna verdadeiro se o nome for válido e falso se houver erro
     */
    function validateNome() {
        /* Remove espaços em branco do início e do fim do texto digitado */
        const val = inputNome.value.trim();
        /* Verifica se o campo ficou em branco */
        if (val === '') {
            showError(inputNome, 'Por favor, informe seu nome completo.');
            return false;
        }
        /* Verifica se o usuário digitou menos de 3 caracteres */
        if (val.length < 3) {
            showError(inputNome, 'O nome deve ter pelo menos 3 caracteres.');
            return false;
        }
        /* Se passou em todas as verificações, limpa o erro e aprova o campo */
        clearError(inputNome);
        return true;
    }

    /**
     * Valida o campo E-mail usando Expressão Regular
     * @returns {boolean} Retorna verdadeiro se o e-mail for válido
     */
    function validateEmail() {
        /* Pega o valor do e-mail sem espaços nas pontas */
        const val = inputEmail.value.trim();
        /* Código Regex padrão para conferir se o texto tem formato de e-mail (nome@dominio.com) */
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        /* Verifica se o e-mail está em branco */
        if (val === '') {
            showError(inputEmail, 'Por favor, informe seu e-mail.');
            return false;
        }
        /* Testa se o e-mail digitado atende à regra do Regex */
        if (!emailRegex.test(val)) {
            showError(inputEmail, 'Insira um e-mail válido (ex: nome@dominio.com).');
            return false;
        }
        /* Se estiver correto, limpa os erros */
        clearError(inputEmail);
        return true;
    }

    /**
     * Valida o campo Telefone
     * @returns {boolean} Retorna verdadeiro se o telefone for válido
     */
    function validateTelefone() {
        /* Remove tudo o que não for número para validar o tamanho real */
        const rawNumbers = inputTelefone.value.replace(/\D/g, '');
        /* Verifica se o telefone está em branco */
        if (rawNumbers === '') {
            showError(inputTelefone, 'Por favor, informe seu telefone com DDD.');
            return false;
        }
        /* Verifica se o telefone tem pelo menos 10 dígitos (fixo) ou 11 (celular) */
        if (rawNumbers.length < 10) {
            showError(inputTelefone, 'Informe um telefone válido com DDD (mínimo 10 dígitos).');
            return false;
        }
        /* Limpa os erros se estiver tudo certo */
        clearError(inputTelefone);
        return true;
    }

    /**
     * Valida se uma opção do menu suspenso de serviços foi selecionada
     * @returns {boolean} Retorna verdadeiro se uma opção válida foi escolhida
     */
    function validateServico() {
        /* Verifica se a opção selecionada está vazia */
        if (selectServico.value === '') {
            showError(selectServico, 'Por favor, selecione o serviço de seu interesse.');
            return false;
        }
        /* Limpa os erros se uma opção válida foi marcada */
        clearError(selectServico);
        return true;
    }

    /**
     * Valida o campo Mensagem
     * @returns {boolean} Retorna verdadeiro se a mensagem tiver tamanho adequado
     */
    function validateMensagem() {
        /* Pega o texto da mensagem sem espaços nas pontas */
        const val = textareaMensagem.value.trim();
        /* Verifica se a mensagem está em branco */
        if (val === '') {
            showError(textareaMensagem, 'Por favor, digite os detalhes do seu projeto ou mensagem.');
            return false;
        }
        /* Exige no mínimo 10 caracteres para evitar mensagens vazias/muito curtas */
        if (val.length < 10) {
            showError(textareaMensagem, 'A mensagem deve ter pelo menos 10 caracteres para podermos te ajudar.');
            return false;
        }
        /* Limpa o erro se estiver aprovado */
        clearError(textareaMensagem);
        return true;
    }


    /* ----------------------------------------------------------------------
       6. LIMPEZA DE ERROS EM TEMPO REAL ENQUANTO O USUÁRIO DIGITA
       ---------------------------------------------------------------------- */
    
    if (inputNome) inputNome.addEventListener('input', validateNome);
    if (inputEmail) inputEmail.addEventListener('input', validateEmail);
    if (inputTelefone) inputTelefone.addEventListener('input', validateTelefone);
    if (selectServico) selectServico.addEventListener('change', validateServico);
    if (textareaMensagem) textareaMensagem.addEventListener('input', validateMensagem);


   
// ----------------------------------------------------------------------
// 7. PROCESSAMENTO E ENVIO DO FORMULÁRIO (SUBMIT)
// ----------------------------------------------------------------------

// Verifica se o formulário existe na página
if (contactForm) {

    // Ouve o evento de envio do formulário
    contactForm.addEventListener('submit', async (e) => {

        // Impede o recarregamento da página
        e.preventDefault();

        // Executa todas as validações do frontend
        const isNomeValid = validateNome();
        const isEmailValid = validateEmail();
        const isTelefoneValid = validateTelefone();
        const isServicoValid = validateServico();
        const isMensagemValid = validateMensagem();

        // Verifica se todos os campos são válidos
        if (
            isNomeValid &&
            isEmailValid &&
            isTelefoneValid &&
            isServicoValid &&
            isMensagemValid
        ) {

            // Organiza os dados que serão enviados ao backend
            const dadosFormulario = {
                nome: inputNome.value.trim(),
                email: inputEmail.value.trim(),
                telefone: inputTelefone.value,
                'servico-interesse': selectServico.value,
                mensagem: textareaMensagem.value.trim()
            };

            try {

                // Envia os dados para o servidor Express
                const resposta = await fetch('http://localhost:3000/contato', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosFormulario)
                });

                // Converte a resposta do servidor para JSON
                const resultado = await resposta.json();

                // Verifica se o servidor encontrou erros
                if (!resposta.ok) {

                    formFeedback.className = 'form-feedback error';

                    formFeedback.textContent =
                        resultado.erros
                            ? resultado.erros.map(erro => erro.msg).join(' ')
                            : 'Não foi possível enviar sua mensagem.';

                    formFeedback.removeAttribute('hidden');
                    formFeedback.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });

                    return;
                }

                // Exibe a mensagem de sucesso
                formFeedback.className = 'form-feedback success';
                formFeedback.textContent =
                    '✓ ' + resultado.mensagem;

                formFeedback.removeAttribute('hidden');

                // Limpa os campos do formulário
                contactForm.reset();

                // Limpa possíveis mensagens de erro
                [inputNome, inputEmail, inputTelefone, selectServico, textareaMensagem]
                    .forEach(campo => clearError(campo));

                // Rola até a mensagem de sucesso
                formFeedback.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });

                // Esconde o aviso após 6 segundos
                setTimeout(() => {
                    formFeedback.setAttribute('hidden', '');
                }, 6000);

            } catch (erro) {

                // Exibe um erro caso o servidor não esteja acessível
                formFeedback.className = 'form-feedback error';
                formFeedback.textContent =
                    'Não foi possível conectar ao servidor. Tente novamente.';

                formFeedback.removeAttribute('hidden');

                console.error('Erro na comunicação com o backend:', erro);
            }

        } else {

            // Exibe um aviso caso existam erros no frontend
            formFeedback.className = 'form-feedback error';
            formFeedback.textContent =
                '✕ Por favor, corrija os erros destacados no formulário.';

            formFeedback.removeAttribute('hidden');

            formFeedback.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    });
}
});