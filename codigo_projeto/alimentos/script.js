// ================================================================
// ESTADO GLOBAL DO CARRINHO
// Vive só na memória: recarregar a página zera o carrinho.
// ================================================================
let cartCount = 0; // quantidade de itens no carrinho
let cartTotal = 0; // valor total em reais

// Elementos do cabeçalho que mostram o carrinho (ids definidos no index.html)
const cartCountEl = document.getElementById('cart-count'); // bolinha amarela com a quantidade
const cartTotalEl = document.getElementById('cart-total'); // texto "R$ 0,00"

// Converte um número para o formato de Real (ex.: 22.9 -> "R$ 22,90").
// Chamada por atualizarCarrinho().
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Escreve cartCount e cartTotal na tela.
// Chamada por adicionarAoCarrinho() e por init().
function atualizarCarrinho() {
  cartCountEl.textContent = cartCount;
  cartTotalEl.textContent = formatarPreco(cartTotal);
}

// ================================================================
// CARRINHO — botões "Adicionar ao carrinho"
// ================================================================

// Soma o produto ao carrinho e dá um feedback visual no botão por 0,9 s.
// O preço vem do atributo data-price do botão (no index.html).
// Chama atualizarCarrinho(). Chamada por inicializarBotoesCarrinho().
function adicionarAoCarrinho(botao) {
  cartCount += 1;
  cartTotal += parseFloat(botao.dataset.price);
  atualizarCarrinho();

  // Troca o texto e a cor do botão (classe .added está no style.css)
  const textoOriginal = botao.textContent;
  botao.textContent = 'Adicionado ✓';
  botao.classList.add('added');
  botao.disabled = true; // evita clique duplo durante o feedback

  // Depois de 900 ms o botão volta ao normal
  setTimeout(() => {
    botao.textContent = textoOriginal;
    botao.classList.remove('added');
    botao.disabled = false;
  }, 900);
}

// Liga cada botão .botao_adicionar_carrinho ao clique -> adicionarAoCarrinho().
// Chamada por init().
function inicializarBotoesCarrinho() {
  document.querySelectorAll('.botao_adicionar_carrinho').forEach((botao) => {
    botao.addEventListener('click', () => adicionarAoCarrinho(botao));
  });
}

// ================================================================
// FAVORITOS — botão de coração em cada card
// ================================================================

// Alterna a classe .ativo no botão (o style.css muda a cor do ícone).
// Também atualiza aria-pressed para leitores de tela. Chamada por init().
function inicializarFavoritos() {
  document.querySelectorAll('.botao_favorito').forEach((botao) => {
    botao.addEventListener('click', () => {
      const ativo = botao.classList.toggle('ativo');
      botao.setAttribute('aria-pressed', ativo);
    });
  });
}

// ================================================================
// BUSCA — campo de texto no cabeçalho
// ================================================================
const inputBusca = document.getElementById('search-input');       // campo de texto
const botaoBusca = document.getElementById('search-btn');         // botão da lupa
const contadorProdutos = document.getElementById('products-count'); // "X produtos encontrados"
const semResultados = document.getElementById('no-results');      // aviso de lista vazia

// Atualiza o texto "X produtos encontrados" (singular/plural) e mostra
// o aviso "Nenhum produto encontrado" quando não sobra nenhum card.
// Chamada por filtrarProdutos(), mostrarOfertas() e mostrarTodosProdutos().
function atualizarContadorProdutos(visiveis) {
  const s = visiveis === 1 ? '' : 's';
  contadorProdutos.textContent = `${visiveis} produto${s} encontrado${s}`;
  semResultados.hidden = visiveis !== 0;
}

// Esconde os cards cujo data-name (nome + marca, em minúsculas) não contém
// o texto digitado. Chama atualizarContadorProdutos().
// Chamada por inicializarBusca().
function filtrarProdutos() {
  const termo = inputBusca.value.trim().toLowerCase();
  let visiveis = 0;

  document.querySelectorAll('.cartao_produto').forEach((card) => {
    const corresponde = (card.dataset.name || '').includes(termo);
    card.hidden = !corresponde; // .hidden é escondido pelo style.css
    if (corresponde) visiveis += 1;
  });

  atualizarContadorProdutos(visiveis);
}

// Filtra enquanto digita, ao clicar na lupa e ao apertar Enter.
// preventDefault() impede que o formulário recarregue a página.
// Chamada por init().
function inicializarBusca() {
  inputBusca.addEventListener('input', filtrarProdutos);

  botaoBusca.addEventListener('click', (evento) => {
    evento.preventDefault();
    filtrarProdutos();
  });

  inputBusca.closest('form').addEventListener('submit', (evento) => {
    evento.preventDefault();
    filtrarProdutos();
  });
}

// ================================================================
// ORDENAÇÃO — seletor "Ordenar por"
// ================================================================
const grade = document.querySelector('.grade_produtos');  // container dos cards
const seletorOrdenar = document.getElementById('ordenar'); // <select> de ordenação

// Guarda a ordem original dos cards para poder voltar a ela
// ("Mais relevantes" e "Mais vendidos" usam essa ordem).
const ordemOriginal = Array.from(grade.children);

// Lê o preço de um card pelo data-price do botão de comprar.
// Usada por ordenarProdutos().
function precoDoCard(card) {
  return parseFloat(card.querySelector('.botao_adicionar_carrinho').dataset.price);
}

// Reordena os cards no HTML conforme a opção escolhida:
// menor preço, maior preço ou ordem original.
// Chamada por inicializarOrdenacao().
function ordenarProdutos() {
  const lista = [...ordemOriginal];
  if (seletorOrdenar.value === 'menor') lista.sort((a, b) => precoDoCard(a) - precoDoCard(b));
  if (seletorOrdenar.value === 'maior') lista.sort((a, b) => precoDoCard(b) - precoDoCard(a));
  lista.forEach((card) => grade.appendChild(card)); // appendChild move o card para o fim, na nova ordem
}

// Liga o seletor -> ordenarProdutos(). Chamada por init().
function inicializarOrdenacao() {
  seletorOrdenar.addEventListener('change', ordenarProdutos);
}

// ================================================================
// MENU / ABA DE OFERTAS
// ================================================================
const linkInicio = document.getElementById('nav-inicio');
const linkOfertas = document.getElementById('nav-ofertas');

// Marca qual item do menu está ativo. No CSS a classe "active" fica no <li>
// (e não no <a>), por isso usamos closest('li').
// Chamada por inicializarMenu() e inicializarBotaoVerOfertas().
function marcarLinkAtivo(linkClicado) {
  document.querySelectorAll('.menu-links li').forEach((li) => li.classList.remove('active'));
  linkClicado.closest('li').classList.add('active');
}

// Mostra só os cards com data-oferta="true" (os maiores descontos).
// Chama atualizarContadorProdutos().
// Chamada por inicializarMenu() e inicializarBotaoVerOfertas().
function mostrarOfertas() {
  let visiveis = 0;
  document.querySelectorAll('.cartao_produto').forEach((card) => {
    const ehOferta = card.dataset.oferta === 'true';
    card.hidden = !ehOferta;
    if (ehOferta) visiveis += 1;
  });
  atualizarContadorProdutos(visiveis);
}

// Volta a mostrar todos os produtos (usado pelo link "Início").
// Chama atualizarContadorProdutos(). Chamada por inicializarMenu().
function mostrarTodosProdutos() {
  const cards = document.querySelectorAll('.cartao_produto');
  cards.forEach((card) => (card.hidden = false));
  atualizarContadorProdutos(cards.length);
}

// Liga os links do menu: "Ofertas" filtra, "Início" mostra tudo e os
// demais só trocam o estilo ativo. Também limpa o campo de busca.
// Chamada por init().
function inicializarMenu() {
  document.querySelectorAll('.menu-links a').forEach((link) => {
    link.addEventListener('click', (evento) => {
      evento.preventDefault();
      marcarLinkAtivo(link);
      inputBusca.value = '';

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

// Filtra pelas ofertas, marca a aba "Ofertas" como ativa e rola a página
// até a lista. Reaproveita mostrarOfertas() e marcarLinkAtivo().
// Chamada por init().
function inicializarBotaoVerOfertas() {
  botaoVerOfertas.addEventListener('click', (evento) => {
    evento.preventDefault();
    inputBusca.value = '';
    mostrarOfertas();
    marcarLinkAtivo(linkOfertas);
    secaoProdutos.scrollIntoView({ behavior: 'smooth' });
  });
}

// ================================================================
// INICIALIZAÇÃO — ponto de entrada do script
// Roda uma vez, quando a página carrega, e liga todas as partes acima.
// ================================================================
function init() {
  atualizarCarrinho();
  inicializarBotoesCarrinho();
  inicializarFavoritos();
  inicializarBusca();
  inicializarOrdenacao();
  inicializarMenu();
  inicializarBotaoVerOfertas();
}

init();
