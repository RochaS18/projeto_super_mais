// ============================================================
// POPUP DO CARRINHO
// ============================================================
(function () {
    "use strict";
    document.addEventListener("DOMContentLoaded", function () {
        const cartTrigger = document.getElementById("cart-trigger");
        const cartModal = document.getElementById("cart-modal");
        const cartClose = document.getElementById("cart-close");
        const cartOverlay = cartModal ? cartModal.querySelector(".cart-modal-overlay") : null;
        const cartContinue = document.getElementById("cart-continue");

        function abrirCarrinho() {
            if (!cartModal) return;
            cartModal.classList.add("is-open");
            cartModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("cart-modal-open");
        }
        function fecharCarrinho() {
            if (!cartModal) return;
            cartModal.classList.remove("is-open");
            cartModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("cart-modal-open");
        }
        if (cartTrigger) cartTrigger.addEventListener("click", e => { e.preventDefault(); abrirCarrinho(); });
        if (cartClose) cartClose.addEventListener("click", fecharCarrinho);
        if (cartOverlay) cartOverlay.addEventListener("click", fecharCarrinho);
        if (cartContinue) cartContinue.addEventListener("click", fecharCarrinho);
        document.addEventListener("keydown", e => { if (e.key === "Escape" && cartModal && cartModal.classList.contains("is-open")) fecharCarrinho(); });
    });
})();
