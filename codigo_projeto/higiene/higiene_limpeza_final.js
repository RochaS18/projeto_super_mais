// ============================================================
// SUPERMAIS - LOGIN, CADASTRO E CARRINHO
// ============================================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        // ========================================================
        // ELEMENTOS DO LOGIN
        // ========================================================

        const loginTrigger = document.getElementById("login-trigger");
        const loginModal = document.getElementById("login-modal");
        const loginClose = document.getElementById("login-close");
        const loginOverlay = loginModal
            ? loginModal.querySelector(".login-modal-overlay")
            : null;

        const loginCard = loginModal
            ? loginModal.querySelector(".login-card")
            : null;

        const loginForm = document.getElementById("login-form");
        const loginEmail = document.getElementById("login-email");
        const loginPassword = document.getElementById("login-password");
        const passwordToggle = document.getElementById("password-toggle");

        const registerLink = document.getElementById("open-register");
        const registerView = document.getElementById("register-view");
        const backToLogin = document.getElementById("back-to-login");
        const registerForm = document.getElementById("register-form");

        // ========================================================
        // ABRIR LOGIN
        // ========================================================

        function mostrarTelaLogin() {
            if (registerView) {
                registerView.hidden = true;
            }

            const loginTitle = document.getElementById("login-modal-title");
            const loginSubtitle = loginCard
                ? loginCard.querySelector(".login-subtitle")
                : null;

            if (loginTitle) loginTitle.hidden = false;
            if (loginSubtitle) loginSubtitle.hidden = false;

            if (loginForm) {
                loginForm.hidden = false;
            }

            const registerBlock = loginCard
                ? loginCard.querySelector(".register")
                : null;
            const divider = loginCard
                ? loginCard.querySelector(".divider")
                : null;
            const socialButtons = loginCard
                ? loginCard.querySelector(".social-buttons")
                : null;

            if (registerBlock) registerBlock.hidden = false;
            if (divider) divider.hidden = false;
            if (socialButtons) socialButtons.hidden = false;
        }

        function mostrarTelaCadastro() {
            const loginTitle = document.getElementById("login-modal-title");
            const loginSubtitle = loginCard
                ? loginCard.querySelector(".login-subtitle")
                : null;

            if (loginTitle) loginTitle.hidden = true;
            if (loginSubtitle) loginSubtitle.hidden = true;

            if (loginForm) {
                loginForm.hidden = true;
            }

            if (registerView) {
                registerView.hidden = false;
            }

            const registerBlock = loginCard
                ? loginCard.querySelector(".register")
                : null;
            const divider = loginCard
                ? loginCard.querySelector(".divider")
                : null;
            const socialButtons = loginCard
                ? loginCard.querySelector(".social-buttons")
                : null;

            if (registerBlock) registerBlock.hidden = true;
            if (divider) divider.hidden = true;
            if (socialButtons) socialButtons.hidden = true;

            const registerName = document.getElementById("register-name");

            if (registerName) {
                setTimeout(function () {
                    registerName.focus();
                }, 100);
            }
        }

        function abrirLogin() {
            if (!loginModal) return;

            mostrarTelaLogin();

            loginModal.classList.add("is-open");
            loginModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("login-modal-open");

            if (loginEmail) {
                setTimeout(function () {
                    loginEmail.focus();
                }, 100);
            }
        }

        if (loginTrigger) {
            loginTrigger.addEventListener("click", function (event) {
                event.preventDefault();
                abrirLogin();
            });
        }

        // ========================================================
        // FECHAR LOGIN
        // ========================================================

        function fecharLogin() {
            if (!loginModal) return;

            loginModal.classList.remove("is-open");
            loginModal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("login-modal-open");

            mostrarTelaLogin();
        }

        if (loginClose) {
            loginClose.addEventListener("click", fecharLogin);
        }

        if (loginOverlay) {
            loginOverlay.addEventListener("click", fecharLogin);
        }

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                loginModal &&
                loginModal.classList.contains("is-open")
            ) {
                fecharLogin();
            }
        });

        // ========================================================
        // ABRIR CADASTRO DENTRO DO POPUP
        // ========================================================

        if (registerLink) {
            registerLink.addEventListener("click", function (event) {
                event.preventDefault();
                mostrarTelaCadastro();
            });
        }

        if (backToLogin) {
            backToLogin.addEventListener("click", function (event) {
                event.preventDefault();
                mostrarTelaLogin();

                if (loginEmail) {
                    setTimeout(function () {
                        loginEmail.focus();
                    }, 100);
                }
            });
        }

        // ========================================================
        // MOSTRAR / OCULTAR SENHA DO LOGIN
        // ========================================================

        if (passwordToggle && loginPassword) {
            passwordToggle.addEventListener("click", function () {
                const mostrarSenha = loginPassword.type === "password";

                loginPassword.type = mostrarSenha ? "text" : "password";
                passwordToggle.textContent = mostrarSenha ? "🙈" : "◉";
                passwordToggle.setAttribute(
                    "aria-label",
                    mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                );
            });
        }

        // ========================================================
        // LOGIN
        // ========================================================

        if (loginForm) {
            loginForm.addEventListener("submit", function (event) {
                event.preventDefault();

                if (!loginEmail || !loginPassword) return;

                const email = loginEmail.value.trim();
                const password = loginPassword.value.trim();

                if (!email || !password) {
                    alert("Preencha o e-mail e a senha.");
                    return;
                }

                const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailValido.test(email)) {
                    alert("Digite um e-mail válido.");
                    loginEmail.focus();
                    return;
                }

                alert("Login realizado com sucesso!");

                loginForm.reset();
                loginPassword.type = "password";

                if (passwordToggle) {
                    passwordToggle.textContent = "◉";
                    passwordToggle.setAttribute("aria-label", "Mostrar senha");
                }

                fecharLogin();
            });
        }

        // ========================================================
        // CRIAÇÃO DE CONTA
        // ========================================================

        if (registerForm) {
            registerForm.addEventListener("submit", function (event) {
                event.preventDefault();

                const nameInput = document.getElementById("register-name");
                const emailInput = document.getElementById("register-email");
                const passwordInput = document.getElementById("register-password");
                const confirmInput = document.getElementById("register-password-confirm");

                if (!nameInput || !emailInput || !passwordInput || !confirmInput) {
                    return;
                }

                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const confirmPassword = confirmInput.value;

                if (!name) {
                    alert("Digite seu nome completo.");
                    nameInput.focus();
                    return;
                }

                const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                if (!emailValido.test(email)) {
                    alert("Digite um e-mail válido.");
                    emailInput.focus();
                    return;
                }

                if (password.length < 6) {
                    alert("A senha deve ter pelo menos 6 caracteres.");
                    passwordInput.focus();
                    return;
                }

                if (password !== confirmPassword) {
                    alert("As senhas não são iguais.");
                    confirmInput.focus();
                    return;
                }

                // Cadastro demonstrativo: não grava dados em banco.
                alert("Conta criada com sucesso!");

                registerForm.reset();
                mostrarTelaLogin();

                if (loginEmail) {
                    loginEmail.value = email;
                    loginEmail.focus();
                }
            });
        }

        // ========================================================
        // CARRINHO DE COMPRAS
        // ========================================================

        let quantidadeCarrinho = 0;
        let valorTotalCarrinho = 0;

        const botoesCarrinho = document.querySelectorAll(".add-to-cart");

        botoesCarrinho.forEach(function (botao) {
            botao.addEventListener("click", function () {
                const precoTexto = botao.dataset.price || "0";
                const preco = parseFloat(
                    precoTexto
                        .replace("R$", "")
                        .replace(/\./g, "")
                        .replace(",", ".")
                        .trim()
                );

                quantidadeCarrinho++;

                if (!isNaN(preco)) {
                    valorTotalCarrinho += preco;
                }

                const contadorCarrinho = document.querySelector(".cart-count");
                if (contadorCarrinho) {
                    contadorCarrinho.textContent = quantidadeCarrinho;
                }

                const textoCarrinho = document.querySelector(".cart-text span");
                if (textoCarrinho) {
                    textoCarrinho.textContent =
                        "R$ " +
                        valorTotalCarrinho.toFixed(2).replace(".", ",");
                }

                const textoOriginal = botao.textContent;
                botao.textContent = "Adicionado ✓";
                botao.classList.add("added");

                setTimeout(function () {
                    botao.textContent = textoOriginal;
                    botao.classList.remove("added");
                }, 1500);
            });
        });
    });
})();
