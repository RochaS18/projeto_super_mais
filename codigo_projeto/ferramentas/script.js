// ===== VARIÁVEIS GLOBAIS =====
const carrinhoFundo = document.querySelector('#carrinho-fundo');
const botoesCarrinho = document.querySelectorAll('.botao-carrinho');
const botaoFechar = document.querySelector('.fechar-carrinho');
const botoesAdicionar = document.querySelectorAll('.adicionar-carrinho');
const itensCarrinho = document.querySelector('#itens-carrinho');
const subtotalCarrinho = document.querySelector('#subtotal-carrinho');
const descontoCarrinho = document.querySelector('#desconto-carrinho');
const totalCarrinho = document.querySelector('#total-carrinho');
const valoresCarrinho = document.querySelectorAll('.valor-carrinho');
const campoCupom = document.querySelector('#cupom');
const botaoCupom = document.querySelector('#aplicar-cupom');
const mensagemCupom = document.querySelector('#mensagem-cupom');
const botaoFinalizar = document.querySelector('.finalizar-carrinho');
const formularioContato = document.querySelector('#formulario-contato');
const carrossel = document.querySelector('.carrossel');

const itens = [];
let cupomAplicado = false;

// ===== CARROSSEL =====
if (carrossel) {
    const ofertas = carrossel.querySelectorAll('.oferta');
    const pontos = carrossel.querySelectorAll('.ponto');
    const setaAnterior = carrossel.querySelector('.anterior');
    const setaProxima = carrossel.querySelector('.proxima');
    let ofertaAtual = 0;
    let intervaloCarrossel;

    function mostrarOferta(indice) {
        ofertaAtual = (indice + ofertas.length) % ofertas.length;

        ofertas.forEach((oferta, numero) => {
            oferta.classList.toggle('ativa', numero === ofertaAtual);
        });

        pontos.forEach((ponto, numero) => {
            ponto.classList.toggle('ativo', numero === ofertaAtual);
        });
    }

    function iniciarCarrossel() {
        clearInterval(intervaloCarrossel);
        intervaloCarrossel = setInterval(() => {
            mostrarOferta(ofertaAtual + 1);
        }, 5000);
    }

    setaAnterior.addEventListener('click', () => {
        mostrarOferta(ofertaAtual - 1);
        iniciarCarrossel();
    });

    setaProxima.addEventListener('click', () => {
        mostrarOferta(ofertaAtual + 1);
        iniciarCarrossel();
    });

    pontos.forEach((ponto, numero) => {
        ponto.addEventListener('click', () => {
            mostrarOferta(numero);
            iniciarCarrossel();
        });
    });

    mostrarOferta(0);
    iniciarCarrossel();
}

// ===== FUNÇÕES DO CARRINHO =====
function abrirCarrinho() {
    if (carrinhoFundo) {
        carrinhoFundo.hidden = false;
    }
}

function fecharCarrinho() {
    if (carrinhoFundo) {
        carrinhoFundo.hidden = true;
    }
}

function atualizarCarrinho() {
    if (!itensCarrinho || !subtotalCarrinho || !descontoCarrinho || !totalCarrinho) {
        return;
    }

    if (itens.length === 0) {
        itensCarrinho.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
        subtotalCarrinho.textContent = 'R$ 0,00';
        descontoCarrinho.textContent = 'R$ 0,00';
        totalCarrinho.textContent = 'R$ 0,00';
        valoresCarrinho.forEach((valor) => valor.textContent = 'R$ 0,00');
        return;
    }

    itensCarrinho.innerHTML = itens.map((item) => `
        <div class="item-carrinho">
            <img src="${item.imagem}" alt="${item.nome}">
            <div>
                <strong>${item.nome}</strong>
                <small>R$ ${item.preco} cada</small>
                <div class="controles-quantidade">
                    <button class="diminuir-quantidade" data-nome="${item.nome}" type="button">-</button>
                    <span>${item.quantidade}</span>
                    <button class="aumentar-quantidade" data-nome="${item.nome}" type="button">+</button>
                </div>
            </div>
            <div class="preco-item">
                <strong>R$ ${formatarMoeda(calcularPreco(item))}</strong>
                <button class="remover-item" data-nome="${item.nome}" type="button">Remover</button>
            </div>
        </div>
    `).join('');

    const subtotal = itens.reduce((soma, item) => soma + calcularPreco(item), 0);
    const desconto = cupomAplicado ? subtotal * 0.1 : 0;

    subtotalCarrinho.textContent = `R$ ${formatarMoeda(subtotal)}`;
    descontoCarrinho.textContent = `R$ ${formatarMoeda(desconto)}`;
    totalCarrinho.textContent = `R$ ${formatarMoeda(subtotal - desconto)}`;
    valoresCarrinho.forEach((valor) => valor.textContent = `R$ ${formatarMoeda(subtotal - desconto)}`);
}

function formatarMoeda(valor) {
    return valor.toFixed(2).replace('.', ',');
}

function calcularPreco(item) {
    return Number(item.preco.replace(',', '.')) * item.quantidade;
}

function encontrarItem(nome) {
    return itens.find((item) => item.nome === nome);
}

function alterarQuantidade(nome, valor) {
    const item = encontrarItem(nome);

    if (!item) {
        return;
    }

    item.quantidade += valor;

    if (item.quantidade <= 0) {
        itens.splice(itens.indexOf(item), 1);
    }

    atualizarCarrinho();
}

// ===== EVENTOS DO CARRINHO =====
botoesCarrinho.forEach((botao) => {
    botao.addEventListener('click', abrirCarrinho);
});

if (botaoFechar) {
    botaoFechar.addEventListener('click', fecharCarrinho);
}

if (carrinhoFundo) {
    carrinhoFundo.addEventListener('click', (evento) => {
        if (evento.target === carrinhoFundo) {
            fecharCarrinho();
        }
    });
}

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
        fecharCarrinho();
    }
});

botoesAdicionar.forEach((botao) => {
    botao.addEventListener('click', () => {
        const nome = botao.dataset.produto;
        const imagem = botao.closest('.produto').querySelector('img').getAttribute('src');
        const itemExistente = encontrarItem(nome);

        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            itens.push({
                nome,
                preco: botao.dataset.preco,
                imagem,
                quantidade: 1
            });
        }

        atualizarCarrinho();
        abrirCarrinho();
    });
});

if (itensCarrinho) {
    itensCarrinho.addEventListener('click', (evento) => {
        const botao = evento.target.closest('button');

        if (!botao) {
            return;
        }

        const nome = botao.dataset.nome;

        if (botao.classList.contains('aumentar-quantidade')) {
            alterarQuantidade(nome, 1);
        }

        if (botao.classList.contains('diminuir-quantidade')) {
            alterarQuantidade(nome, -1);
        }

        if (botao.classList.contains('remover-item')) {
            const item = encontrarItem(nome);
            itens.splice(itens.indexOf(item), 1);
            atualizarCarrinho();
        }
    });
}

if (botaoCupom) {
    botaoCupom.addEventListener('click', () => {
        const codigo = campoCupom.value.trim().toUpperCase();

        if (codigo === 'SUPER10') {
            cupomAplicado = true;
            mensagemCupom.textContent = 'Cupom aplicado: 10% de desconto.';
            mensagemCupom.className = 'cupom-valido';
        } else {
            cupomAplicado = false;
            mensagemCupom.textContent = 'Cupom inválido. Tente SUPER10.';
            mensagemCupom.className = 'cupom-invalido';
        }

        atualizarCarrinho();
    });
}

if (botaoFinalizar) {
    botaoFinalizar.addEventListener('click', () => {
        if (itens.length === 0) {
            alert('Adicione algum produto ao carrinho primeiro.');
            return;
        }

        window.location.href = 'pagamento.html';
    });
}

// ===== FORMULÁRIO DE CONTATO =====
if (formularioContato) {
    formularioContato.addEventListener('submit', (evento) => {
        evento.preventDefault();
        document.querySelector('#mensagem-formulario').textContent = 'Mensagem enviada! Em breve entraremos em contato.';
        formularioContato.reset();
    });
}

// ===== PAGAMENTO =====
const formularioPagamento = document.querySelector('#formulario-pagamento');
const modalPagamento = document.querySelector('#modal-pagamento');
const numeroCartaoVisivel = document.querySelector('#numero-cartao');
const nomeCartaoVisivel = document.querySelector('#nome-cartao');
const validadeCartaoVisivel = document.querySelector('#validade-cartao');
const cvcCartaoVisivel = document.querySelector('#cvc-cartao');

function formatarNumeroCartao(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 16);
    return numeros.replace(/(.{4})/g, '$1 ').trim();
}

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

        modalPagamento.classList.add('aberto');
        modalPagamento.setAttribute('aria-hidden', 'false');
        formularioPagamento.reset();
        atualizarPreviewPagamento();
    });

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

atualizarCarrinho();
