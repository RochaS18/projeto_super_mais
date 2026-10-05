/* SuperMais — comportamento do carrinho demonstrativo.
   Em produção, os produtos e preços devem vir de uma API confiável. */

// Configurações demonstrativas do protótipo.
// Alterar estes valores muda regras de negócio simples, como frete, cupom e imagem padrão.
const CONFIG = {
  limiteFreteGratis: 200,
  valorFrete: 12.9,
  codigoCupom: "MERCADO6",
  descontoCupom: 6,
  valorMinimoCupom: 50,
  imagemPadrao: "assets/images/produto-placeholder.svg",
};

// Cada produto usa uma imagem local. dai é so trocar o caminho por sua própria imagem
// dentro de assets/images/ .
//const carrinho = [
 // { id: 1, nome: "Arroz Branco Camil Tipo 1", detalhe: "Pacote 5 kg", preco: 22.9, quantidade: 2, selo: "Oferta do dia", imagem: CONFIG.imagemPadrao },
 // { id: 2, nome: "Leite Integral Italac", detalhe: "Caixa 1 L", preco: 6.49, quantidade: 3, selo: "Leve 3, pague 2", imagem: CONFIG.imagemPadrao },
 // { id: 3, nome: "Banana Prata", detalhe: "Aproximadamente 1 kg", preco: 7.99, quantidade: 1, selo: "Produto fresco", imagem: CONFIG.imagemPadrao },
//];

// Recomendações de exemplo. Produtos adicionados passam a integrar o carrinho.
const sugestoes = [
  { id: 4, nome: "Café Torrado e Moído", detalhe: "Pacote 500 g", preco: 18.9, selo: "Combina com seu café da manhã" },
  { id: 5, nome: "Açúcar Refinado", detalhe: "Pacote 1 kg", preco: 4.79, selo: "Item essencial" },
  { id: 6, nome: "Óleo de Soja", detalhe: "Garrafa 900 ml", preco: 7.49, selo: "Mais vendidos" },
  { id: 7, nome: "Feijão Carioca", detalhe: "Pacote 1 kg", preco: 8.99, selo: "Boa escolha" },
];

// Estado do cupom. Fica separado dos produtos para o desconto poder ser ligado/desligado.
let cupomAplicado = false;

// Atalho para buscar elementos pelo id e evitar repetir document.getElementById em todo lugar.
const porId = (id) => document.getElementById(id);

// Proteção básica antes de montar HTML com dados de produto.
// Assim, nomes e detalhes viram texto seguro quando entram na tela.
const escaparHTML = (valor) => String(valor).replace(/[&<>"']/g, (caractere) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[caractere]);

/** Formata um valor numérico como moeda brasileira. */
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Soma as unidades, subtotal, desconto e valor de entrega do carrinho. */
function calcularResumo() {
  // Quantidade total de itens considerando todas as unidades de cada produto.
  const quantidade = carrinho.reduce((soma, produto) => soma + produto.quantidade, 0);

  // Subtotal bruto: preço unitário multiplicado pela quantidade de cada item.
  const subtotal = carrinho.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);

  // Regras de entrega e desconto usadas para atualizar o resumo do pedido.
  const freteGratis = subtotal >= CONFIG.limiteFreteGratis;
  const entrega = subtotal === 0 || freteGratis ? 0 : CONFIG.valorFrete;
  const desconto = cupomAplicado && subtotal >= CONFIG.valorMinimoCupom ? CONFIG.descontoCupom : 0;
  return { quantidade, subtotal, freteGratis, entrega, desconto, total: Math.max(0, subtotal + entrega - desconto) };
}

/** Desenha a lista de produtos usando dados escapados antes de inserir HTML. */
function renderizarProdutos() {
  const lista = porId("listaProdutos");

  // Quando não há produtos, troca a lista por uma mensagem simples e acessível.
  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
    return;
  }

  // Cada item vira um <article>. Os data-attributes indicam qual ação o clique deve executar.
  lista.innerHTML = carrinho.map((produto) => `
    <article class="produto">
      <div class="imagem-produto"><img src="${escaparHTML(produto.imagem)}" alt="${escaparHTML(produto.nome)}" loading="lazy" /></div>
      <div class="detalhes-produto">
        <h3>${escaparHTML(produto.nome)}</h3><p>${escaparHTML(produto.detalhe)}</p>
        <span class="selo">${escaparHTML(produto.selo)}</span>
      </div>
      <div class="preco-unitario">Preço unitário<strong>${formatarMoeda(produto.preco)}</strong></div>
      <div class="quantidade" aria-label="Quantidade de ${escaparHTML(produto.nome)}">
        <button type="button" data-acao="diminuir" data-id="${produto.id}" aria-label="Diminuir quantidade de ${escaparHTML(produto.nome)}" ${produto.quantidade <= 1 ? "disabled" : ""}>−</button>
        <span aria-live="polite">${produto.quantidade}</span>
        <button type="button" data-acao="aumentar" data-id="${produto.id}" aria-label="Aumentar quantidade de ${escaparHTML(produto.nome)}">+</button>
      </div>
      <button class="remover" type="button" data-acao="remover" data-id="${produto.id}" aria-label="Remover ${escaparHTML(produto.nome)}">×</button>
    </article>`).join("");
}

/** Renderiza cartões recomendados e indica quando o item já está no carrinho. */
function renderizarSugestoes() {
  porId("listaSugestoes").innerHTML = sugestoes.map((produto) => {
    // Se a sugestão já estiver no carrinho, o botão passa a adicionar mais uma unidade.
    const noCarrinho = carrinho.some((item) => item.id === produto.id);
    return `
      <article class="sugestao-produto">
        <div class="sugestao-imagem"><img src="${escaparHTML(CONFIG.imagemPadrao)}" alt="${escaparHTML(produto.nome)}" loading="lazy" /></div>
        <h3>${escaparHTML(produto.nome)}</h3>
        <p>${escaparHTML(produto.detalhe)} · ${escaparHTML(produto.selo)}</p>
        <div class="sugestao-rodape"><strong>${formatarMoeda(produto.preco)}</strong>
          <button class="adicionar-sugestao" type="button" data-adicionar="${produto.id}" aria-label="${noCarrinho ? "Adicionar mais uma unidade de" : "Adicionar"} ${escaparHTML(produto.nome)} ao carrinho">${noCarrinho ? "+ 1" : "+"}</button>
        </div>
      </article>`;
  }).join("");
}

/** Atualiza lista, contador, frete e todos os valores do resumo. */
function renderizarCarrinho() {
  renderizarProdutos();
  renderizarSugestoes();
  const resumo = calcularResumo();

  // Valores monetários exibidos no resumo lateral.
  porId("subtotal").textContent = formatarMoeda(resumo.subtotal);
  porId("valorDesconto").textContent = resumo.desconto ? `− ${formatarMoeda(resumo.desconto)}` : formatarMoeda(0);
  porId("valorEntrega").textContent = resumo.entrega ? formatarMoeda(resumo.entrega) : "Grátis";
  porId("valorTotal").textContent = formatarMoeda(resumo.total);
  porId("totalTopo").textContent = formatarMoeda(resumo.total);
  porId("contadorTopo").textContent = resumo.quantidade;
  porId("textoItens").textContent = `${resumo.quantidade} ${resumo.quantidade === 1 ? "item selecionado" : "itens selecionados"}`;

  // Mensagem dinâmica que orienta o usuário sobre o frete grátis.
  porId("tituloFrete").textContent = resumo.freteGratis ? "Frete grátis!" : "Frete calculado";
  porId("textoFrete").textContent = resumo.freteGratis
    ? "Seu pedido atingiu o valor mínimo para entrega grátis."
    : resumo.subtotal === 0
      ? "Adicione produtos ao carrinho."
      : `Faltam ${formatarMoeda(CONFIG.limiteFreteGratis - resumo.subtotal)} para ganhar frete grátis.`;
  porId("botaoFinalizar").disabled = resumo.quantidade === 0;

  // Se o usuário remove itens e fica abaixo do mínimo, o cupom é cancelado automaticamente.
  if (cupomAplicado && resumo.subtotal < CONFIG.valorMinimoCupom) {
    cupomAplicado = false;
    mostrarMensagemCupom(`O subtotal mínimo para o cupom é ${formatarMoeda(CONFIG.valorMinimoCupom)}.`, "erro");
  }
}

/** Mostra uma mensagem acessível sobre o estado do cupom. */
function mostrarMensagemCupom(texto, tipo = "") {
  const mensagem = porId("mensagemCupom");
  mensagem.textContent = texto;
  mensagem.className = `mensagem-cupom ${tipo}`.trim();
}

// Delegação de eventos: os botões continuam funcionando após redesenhar a lista.
porId("listaProdutos").addEventListener("click", (evento) => {
  // Busca o botão clicado dentro da lista; cliques fora de botões são ignorados.
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) return;
  const id = Number(botao.dataset.id);
  const indice = carrinho.findIndex((produto) => produto.id === id);
  if (indice < 0) return;

  if (botao.dataset.acao === "remover") carrinho.splice(indice, 1);
  if (botao.dataset.acao === "aumentar") carrinho[indice].quantidade += 1;
  if (botao.dataset.acao === "diminuir") carrinho[indice].quantidade = Math.max(1, carrinho[indice].quantidade - 1);
  porId("mensagemCheckout").textContent = "";
  renderizarCarrinho();
});

porId("listaSugestoes").addEventListener("click", (evento) => {
  // A lista de sugestões também usa delegação para funcionar após cada renderização.
  const botao = evento.target.closest("button[data-adicionar]");
  if (!botao) return;
  const produto = sugestoes.find((item) => item.id === Number(botao.dataset.adicionar));
  if (!produto) return;
  const existente = carrinho.find((item) => item.id === produto.id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({ ...produto, quantidade: 1, imagem: CONFIG.imagemPadrao });
  }
  porId("mensagemSugestao").textContent = `${produto.nome} foi adicionado ao carrinho.`;
  renderizarCarrinho();
});

porId("botaoLimpar").addEventListener("click", () => {
  // Esvazia o array original sem trocar sua referência, mantendo o estado previsível.
  carrinho.splice(0, carrinho.length);
  cupomAplicado = false;
  mostrarMensagemCupom("");
  porId("mensagemCheckout").textContent = "";
  renderizarCarrinho();
});

porId("formCupom").addEventListener("submit", (evento) => {
  evento.preventDefault();

  // Normaliza o cupom digitado para aceitar letras minúsculas ou maiúsculas.
  const codigo = porId("campoCupom").value.trim().toLocaleUpperCase("pt-BR");
  const subtotal = calcularResumo().subtotal;
  if (codigo !== CONFIG.codigoCupom) {
    cupomAplicado = false;
    mostrarMensagemCupom("Cupom não reconhecido. Confira o código e tente novamente.", "erro");
  } else if (subtotal < CONFIG.valorMinimoCupom) {
    cupomAplicado = false;
    mostrarMensagemCupom(`O cupom exige subtotal mínimo de ${formatarMoeda(CONFIG.valorMinimoCupom)}.`, "erro");
  } else {
    cupomAplicado = true;
    mostrarMensagemCupom(`Cupom aplicado: ${formatarMoeda(CONFIG.descontoCupom)} de desconto.`, "sucesso");
    porId("campoCupom").value = "";
  }
  renderizarCarrinho();
});

// Busca demonstrativa: impede recarregamento enquanto não houver página/API de resultados.
porId("formBusca").addEventListener("submit", (evento) => evento.preventDefault());

// Botão final de checkout ainda é demonstrativo e mostra uma orientação na tela.
porId("botaoFinalizar").addEventListener("click", () => {
  porId("mensagemCheckout").textContent = "Demonstração apenas";
});

// Primeiro desenho da tela ao carregar o documento.
renderizarCarrinho();
