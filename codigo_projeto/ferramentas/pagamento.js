// ===== PAGAMENTO =====
// Guarda referências aos campos, botões e painéis da página de pagamento.
const formularioPagamento = document.querySelector('#formulario-pagamento');
const modalPagamento = document.querySelector('#modal-pagamento');
const numeroCartaoVisivel = document.querySelector('#numero-cartao');
const nomeCartaoVisivel = document.querySelector('#nome-cartao');
const validadeCartaoVisivel = document.querySelector('#validade-cartao');
const cvcCartaoVisivel = document.querySelector('#cvc-cartao');
const botoesMetodoPagamento = document.querySelectorAll('.metodo-pagamento');
const painelPixVisual = document.querySelector('#visual-pix');
const painelCartaoVisual = document.querySelector('#visual-cartao');
const detalhesPix = document.querySelector('.detalhes-pix');
const formularioCartao = document.querySelector('#formulario-cartao');
const codigoPixInput = document.querySelector('#codigo-pix');
const valorPix = document.querySelector('#valor-pix');
const botaoCopiarPix = document.querySelector('#copiar-pix');
const mensagemPix = document.querySelector('#mensagem-pix');
const botaoSimularPix = document.querySelector('#simular-pix');

// Cada parte do código Pix tem um identificador, seu tamanho e seu valor.
function criarCampoPix(id, valor) {
    return `${id}${String(valor.length).padStart(2, '0')}${valor}`;
}

// Calcula os quatro caracteres de verificação no fim do código Pix.
function calcularCrc16(texto) {
    let crc = 0xFFFF;

    for (const caractere of texto) {
        crc ^= caractere.charCodeAt(0) << 8;
        for (let bit = 0; bit < 8; bit += 1) {
            crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
            crc &= 0xFFFF;
        }
    }

    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Monta um código Pix de demonstração com o valor recebido do carrinho.
function criarCodigoPix(valor) {
    const contaPix = criarCampoPix('00', 'BR.GOV.BCB.PIX') + criarCampoPix('01', 'pix-demo@supermais.invalid');
    const valorFormatado = valor > 0 ? criarCampoPix('54', valor.toFixed(2)) : '';
    const dadosAdicionais = criarCampoPix('05', '***');
    const codigo = `000201${criarCampoPix('26', contaPix)}520400005303986${valorFormatado}5802BR${criarCampoPix('59', 'SUPER MAIS')}${criarCampoPix('60', 'SAO PAULO')}${criarCampoPix('62', dadosAdicionais)}6304`;

    return `${codigo}${calcularCrc16(codigo)}`;
}

// Exibe o total e gera o QR Code para o código criado acima.
function atualizarPagamentoPix() {
    if (!codigoPixInput) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const valorPedido = Number(parametros.get('valor')) || 0;
    const codigo = criarCodigoPix(valorPedido);

    codigoPixInput.value = codigo;

    if (valorPix) {
        valorPix.textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorPedido);
    }

    const elementoQr = document.querySelector('#qrcode-pix');
    if (elementoQr && window.QRCode) {
        new QRCode(elementoQr, { text: codigo, width: 190, height: 190 });
    }
}

// Mostra os dados do Pix ou do cartão, conforme a opção escolhida.
botoesMetodoPagamento.forEach((botao) => {
    botao.addEventListener('click', () => {
        const usarPix = botao.dataset.metodo === 'pix';

        botoesMetodoPagamento.forEach((opcao) => {
// Copia o código Pix; se o navegador bloquear a cópia, seleciona o texto.
            const selecionado = opcao === botao;
            opcao.classList.toggle('ativo', selecionado);
            opcao.setAttribute('aria-pressed', String(selecionado));
        });

        painelPixVisual.hidden = !usarPix;
        detalhesPix.hidden = !usarPix;
        painelCartaoVisual.hidden = usarPix;
        formularioCartao.hidden = usarPix;
    });
});

if (botaoCopiarPix && codigoPixInput) {
    botaoCopiarPix.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(codigoPixInput.value);
            mensagemPix.textContent = 'Código Pix copiado.';
        } catch {
            codigoPixInput.select();
            document.execCommand('copy');
            mensagemPix.textContent = 'Código Pix selecionado para copiar.';
        }
    });
}

// Este botão é apenas uma demonstração: não confirma uma cobrança real.
if (botaoSimularPix && modalPagamento) {
    botaoSimularPix.addEventListener('click', () => {
        document.querySelector('#titulo-modal').textContent = 'Simulação concluída';
        document.querySelector('#titulo-modal + p').textContent = 'Nenhuma cobrança real foi realizada. Configure uma integração Pix para receber pagamentos.';
        modalPagamento.classList.add('aberto');
        modalPagamento.setAttribute('aria-hidden', 'false');
    });
}

atualizarPagamentoPix();

// Formata o número em grupos de quatro dígitos para a prévia do cartão.
function formatarNumeroCartao(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 16);
    return numeros.replace(/(.{4})/g, '$1 ').trim();
}

// Apaga a mensagem de erro de um campo depois que ele for corrigido.
function limparMensagemErro(campo) {
    const erro = document.querySelector(`[data-erro="${campo}"]`);
    if (erro) {
        erro.textContent = '';
    }
}

if (formularioPagamento) {
    const numeroInput = document.querySelector('#numero-cartao-input');
    const nomeInput = document.querySelector('#nome-cartao-input');
    const mesInput = document.querySelector('#mes-cartao');
    const anoInput = document.querySelector('#ano-cartao');
    const cvcInput = document.querySelector('#cvc-cartao-input');
    const botaoFecharModal = document.querySelector('.fechar-modal');

    // Atualiza a prévia do cartão enquanto os campos são preenchidos.
    function atualizarPreviewPagamento() {
        if (numeroCartaoVisivel) {
            numeroCartaoVisivel.textContent = formatarNumeroCartao(numeroInput.value || '0000000000000000');
        }

        if (nomeCartaoVisivel) {
            nomeCartaoVisivel.textContent = (nomeInput.value || 'NOME DO TITULAR').toUpperCase();
        }

        if (validadeCartaoVisivel) {
            const mes = mesInput.value || 'MM';
            const ano = anoInput.value || 'AA';
            validadeCartaoVisivel.textContent = `${mes}/${ano}`;
        }

        if (cvcCartaoVisivel) {
            cvcCartaoVisivel.textContent = cvcInput.value ? cvcInput.value.slice(0, 3).padEnd(3, '*') : '***';
        }
    }

    [numeroInput, nomeInput, mesInput, anoInput, cvcInput].forEach((campo) => {
        campo.addEventListener('input', atualizarPreviewPagamento);
    });

    // Confere os campos antes de mostrar a confirmação do cartão.
    formularioPagamento.addEventListener('submit', (evento) => {
        evento.preventDefault();
        let valido = true;

        if (!numeroInput.value || numeroInput.value.replace(/\D/g, '').length < 16) {
            document.querySelector('[data-erro="numero"]').textContent = 'Informe um número de cartão válido.';
            valido = false;
        } else {
            limparMensagemErro('numero');
        }

        if (!nomeInput.value.trim()) {
            document.querySelector('[data-erro="nome"]').textContent = 'Digite o nome do titular.';
            valido = false;
        } else {
            limparMensagemErro('nome');
        }

        if (!mesInput.value || Number(mesInput.value) < 1 || Number(mesInput.value) > 12) {
            document.querySelector('[data-erro="mes"]').textContent = 'Mês inválido.';
            valido = false;
        } else {
            limparMensagemErro('mes');
        }

        if (!anoInput.value || anoInput.value.length !== 2) {
            document.querySelector('[data-erro="ano"]').textContent = 'Ano inválido.';
            valido = false;
        } else {
            limparMensagemErro('ano');
        }

        if (!cvcInput.value || cvcInput.value.length < 3) {
            document.querySelector('[data-erro="cvc"]').textContent = 'Informe o CVC corretamente.';
            valido = false;
        } else {
            limparMensagemErro('cvc');
        }

        if (!valido) {
            return;
        }

        document.querySelector('#titulo-modal').textContent = 'Pagamento confirmado';
        document.querySelector('#titulo-modal + p').textContent = 'Sua compra foi concluída com sucesso.';
        modalPagamento.classList.add('aberto');
        modalPagamento.setAttribute('aria-hidden', 'false');
        formularioPagamento.reset();
        atualizarPreviewPagamento();
    });

    // Permite fechar a confirmação pelo botão, clicando fora ou com Escape.
    if (botaoFecharModal) {
        botaoFecharModal.addEventListener('click', () => {
            modalPagamento.classList.remove('aberto');
            modalPagamento.setAttribute('aria-hidden', 'true');
        });
    }

    modalPagamento.addEventListener('click', (evento) => {
        if (evento.target === modalPagamento) {
            modalPagamento.classList.remove('aberto');
            modalPagamento.setAttribute('aria-hidden', 'true');
        }
    });

    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && modalPagamento.classList.contains('aberto')) {
            modalPagamento.classList.remove('aberto');
            modalPagamento.setAttribute('aria-hidden', 'true');
        }
    });

    atualizarPreviewPagamento();
}