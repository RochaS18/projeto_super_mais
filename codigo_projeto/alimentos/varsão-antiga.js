// ================================================================
// ESTADO GLOBAL DO CARRINHO
// Vive só na memória (recarregar a página zera o carrinho).
// ================================================================
let cartCount = 0;
let cartTotal = 0;

const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');

// Formata número em Real (R$ 0,00). Usada por atualizarCarrinho().
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Escreve cartCount/cartTotal na tela. Chamada por adicionarAoCarrinho() e por init().
function atualizarCarrinho() {
  cartCountEl.textContent = cartCount;
  cartTotalEl.textContent = formatarPreco(cartTotal);
}

// ================================================================
// CARRINHO — botões "Adicionar ao carrinho"
// ================================================================

// Soma o produto ao carrinho e dá feedback visual no botão. Chama atualizarCarrinho().
function adicionarAoCarrinho(botao) {
  const preco = parseFloat(botao.dataset.price);
  cartCount += 1;
  cartTotal += preco;
  atualizarCarrinho();

  const textoOriginal = botao.textContent;
  botao.textContent = 'Adicionado ✓';
  botao.classList.add('added');
  botao.disabled = true;

  setTimeout(() => {
    botao.textContent = textoOriginal;
    botao.classList.remove('added');
    botao.disabled = false;
  }, 900);
}

// Liga cada botão .btn-add ao clique -> adicionarAoCarrinho(). Chamada por init().
function inicializarBotoesCarrinho() {
  document.querySelectorAll('.btn-add').forEach((botao) => {
    botao.addEventListener('click', () => adicionarAoCarrinho(botao));
  });
}

// ================================================================
// BUSCA — campo de texto no cabeçalho
// ================================================================
const inputBusca = document.getElementById('search-input');
const botaoBusca = document.getElementById('search-btn');
const contadorProdutos = document.getElementById('products-count');
const semResultados = document.getElementById('no-results');

// Mostra/esconde texto "X produtos encontrados" e o aviso de "nada encontrado".
// Chamada por filtrarProdutos() e por mostrarOfertas()/mostrarTodosProdutos().
function atualizarContadorProdutos(visiveis) {
  contadorProdutos.textContent = `${visiveis} produto${visiveis === 1 ? '' : 's'} encontrado${visiveis === 1 ? '' : 's'}`;
  semResultados.hidden = visiveis !== 0;
}

// Esconde os cards cujo nome não bate com o texto digitado. Chama atualizarContadorProdutos().
function filtrarProdutos() {
  const termo = inputBusca.value.trim().toLowerCase();
  let visiveis = 0;

  document.querySelectorAll('.product-card').forEach((card) => {
    const corresponde = (card.dataset.name || '').includes(termo);
    card.hidden = !corresponde;
    if (corresponde) visiveis += 1;
  });

  atualizarContadorProdutos(visiveis);
}

// Liga o input (digitação) e o botão "Buscar" -> filtrarProdutos(). Chamada por init().
function inicializarBusca() {
  inputBusca.addEventListener('input', filtrarProdutos);
  botaoBusca.addEventListener('click', (evento) => {
    evento.preventDefault();
    filtrarProdutos();
  });
}

// ================================================================
// MENU / ABA DE OFERTAS
// ================================================================
const linkInicio = document.getElementById('nav-inicio');
const linkOfertas = document.getElementById('nav-ofertas');

// Marca visualmente qual link do menu está ativo no momento.
function marcarLinkAtivo(linkClicado) {
  document.querySelectorAll('.nav-menu a').forEach((l) => l.classList.remove('active'));
  linkClicado.classList.add('active');
}

// Mostra só os produtos com data-oferta="true" (maiores descontos). Chama atualizarContadorProdutos().
function mostrarOfertas() {
  let visiveis = 0;
  document.querySelectorAll('.product-card').forEach((card) => {
    const ehOferta = card.dataset.oferta === 'true';
    card.hidden = !ehOferta;
    if (ehOferta) visiveis += 1;
  });
  atualizarContadorProdutos(visiveis);
}

// Volta a mostrar todos os produtos (usado por "Início"). Chama atualizarContadorProdutos().
function mostrarTodosProdutos() {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card) => (card.hidden = false));
  atualizarContadorProdutos(cards.length);
}

// Liga os links do menu: "Ofertas" filtra, "Início" reseta, os demais só trocam o estilo ativo.
// Chama marcarLinkAtivo() + mostrarOfertas()/mostrarTodosProdutos(). Chamada por init().
function inicializarMenu() {
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    link.addEventListener('click', (evento) => {
      evento.preventDefault();
      marcarLinkAtivo(link);

      if (link === linkOfertas) mostrarOfertas();
      if (link === linkInicio) mostrarTodosProdutos();
    });
  });
}

// ================================================================
// BOTÃO "Ver ofertas" DO BANNER
// ================================================================
const botaoVerOfertas = document.getElementById('ver-ofertas-btn');
const secaoProdutos = document.getElementById('products-section');

// Filtra pelas ofertas, marca a aba "Ofertas" como ativa e rola até a lista.
// Reaproveita mostrarOfertas() e marcarLinkAtivo() em vez de repetir lógica. Chamada por init().
function inicializarBotaoVerOfertas() {
  botaoVerOfertas.addEventListener('click', () => {
    mostrarOfertas();
    marcarLinkAtivo(linkOfertas);
    secaoProdutos.scrollIntoView({ behavior: 'smooth' });
  });
}

// ================================================================
// INICIALIZAÇÃO — ponto de entrada do script
// Roda uma vez, no carregamento da página, e liga todas as partes acima.
// ================================================================
function init() {
  atualizarCarrinho();
  inicializarBotoesCarrinho();
  inicializarBusca();
  inicializarMenu();
  inicializarBotaoVerOfertas();
}

init();
