// ============================================================
// HIGIENE E LIMPEZA - PRODUTOS / CARRINHO
// Este arquivo fica somente com a lógica da página principal.
// Login e popup do carrinho ficam em arquivos separados.
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
    let quantidadeCarrinho = 0;
    let valorTotalCarrinho = 0;

    const botoesCarrinho = document.querySelectorAll(".add-to-cart");

    function atualizarCarrinho() {
        const contador = document.querySelector(".cart-count");
        const total = document.querySelector(".cart-text span");

        if (contador) contador.textContent = quantidadeCarrinho;
        if (total) {
            total.textContent = "R$ " + valorTotalCarrinho.toFixed(2).replace(".", ",");
        }
    }

    botoesCarrinho.forEach(function (botao) {
        botao.addEventListener("click", function () {
            const precoTexto = botao.dataset.price || "0";
            const preco = parseFloat(
                precoTexto.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
            );

            quantidadeCarrinho++;
            if (!isNaN(preco)) valorTotalCarrinho += preco;
            atualizarCarrinho();

            const textoOriginal = botao.textContent;
            botao.textContent = "Adicionado ✓";
            botao.classList.add("added");

            setTimeout(function () {
                botao.textContent = textoOriginal;
                botao.classList.remove("added");
            }, 1500);
        });
    });

    atualizarCarrinho();
});
