// ===== VARIÁVEIS GLOBAIS =====
// Busca os elementos do carrinho que aparecem nas páginas da loja.
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

// Guarda os produtos adicionados e informa se o cupom está ativo.
const itens = [];
let cupomAplicado = false;

// ===== FUNÇÕES DO CARRINHO =====
// Mostra o painel do carrinho.
function abrirCarrinho() {
    if (carrinhoFundo) {
        carrinhoFundo.hidden = false;
    }
}

// Esconde o painel do carrinho.
function fecharCarrinho() {
    if (carrinhoFundo) {
        carrinhoFundo.hidden = true;
    }
}

// Atualiza produtos, subtotal, desconto e total na tela.
function atualizarCarrinho() {
    if (!itensCarrinho || !subtotalCarrinho || !descontoCarrinho || !totalCarrinho) {
        return;
    }

    if (itens.length === 0) {
        // Exibe os valores zerados quando não há produtos.
        itensCarrinho.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
        subtotalCarrinho.textContent = 'R$ 0,00';
        descontoCarrinho.textContent = 'R$ 0,00';
        totalCarrinho.textContent = 'R$ 0,00';
        valoresCarrinho.forEach((valor) => valor.textContent = 'R$ 0,00');
        return;
    }

    // Cria uma linha do carrinho para cada produto.
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

    // Mostra os valores calculados no resumo e no botão do carrinho.
    subtotalCarrinho.textContent = `R$ ${formatarMoeda(subtotal)}`;
    descontoCarrinho.textContent = `R$ ${formatarMoeda(desconto)}`;
    totalCarrinho.textContent = `R$ ${formatarMoeda(subtotal - desconto)}`;
    valoresCarrinho.forEach((valor) => valor.textContent = `R$ ${formatarMoeda(subtotal - desconto)}`);
}

// Deixa o valor no formato usado no Brasil.
function formatarMoeda(valor) {
    return valor.toFixed(2).replace('.', ',');
}

// Calcula o preço de todas as unidades de um produto.
function calcularPreco(item) {
    return Number(item.preco.replace(',', '.')) * item.quantidade;
}

// Procura um produto pelo nome e devolve o resultado.
function encontrarItem(nome) {
    return itens.find((item) => item.nome === nome);
}

// Altera a quantidade e remove o produto quando ela chega a zero.
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
// Abre o carrinho pelos botões do cabeçalho.
botoesCarrinho.forEach((botao) => {
    botao.addEventListener('click', abrirCarrinho);
});

if (botaoFechar) {
    botaoFechar.addEventListener('click', fecharCarrinho);
}

// Também fecha ao clicar fora do painel ou pressionar Escape.
if (carrinhoFundo) {
    carrinhoFundo.addEventListener('click', (evento) => {
        if (evento.target === carrinhoFundo) {
            fecharCarrinho();
        }
    });
}

document.addEventListener('keydown', (evento) => {
// Adiciona um produto novo ou aumenta a quantidade do que já está no carrinho.
    if (evento.key === 'Escape') {
        fecharCarrinho();
    }
});

botoesAdicionar.forEach((botao) => {
// Trata os botões de quantidade e remoção dentro do carrinho.
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

// Aplica o desconto quando o código informado é SUPER10.
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

// Calcula o total e envia esse valor para a página de pagamento.
if (botaoFinalizar) {
    botaoFinalizar.addEventListener('click', () => {
        if (itens.length === 0) {
            alert('Adicione algum produto ao carrinho primeiro.');
            return;
        }

        const subtotal = itens.reduce((soma, item) => soma + calcularPreco(item), 0);
        const desconto = cupomAplicado ? subtotal * 0.1 : 0;
        const total = (subtotal - desconto).toFixed(2);
        window.location.href = `pagamento.html?valor=${total}`;
    });
}

// Mostra o estado inicial do carrinho ao abrir uma página.
atualizarCarrinho();
