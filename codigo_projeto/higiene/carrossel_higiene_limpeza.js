// ============================================================
// CARROSSEL DO BANNER - HIGIENE E LIMPEZA
// ============================================================

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        const banner = document.querySelector(".banner");
        if (!banner) return;

        const title = banner.querySelector(".banner-title");
        const description = banner.querySelector(".banner-description");
        const actionText = banner.querySelector(".banner-action-text");
        const image = banner.querySelector(".banner-image img");
        const leftButton = banner.querySelector(".slider-left");
        const rightButton = banner.querySelector(".slider-right");
        const dots = Array.from(banner.querySelectorAll(".slider-dots button"));

        const slides = [
            {
                title: "Higiene e limpeza",
                highlight: "para o seu dia a dia!",
                description: "Produtos para cuidar da sua higiene, da sua casa e de toda a família.",
                action: "Ver ofertas",
                image: "imagem/banner_higiene_limpeza.png",
                alt: "Produtos de higiene e limpeza"
            },
            {
                title: "Higiene pessoal",
                highlight: "cuide de você todos os dias!",
                description: "Encontre produtos para banho, corpo e cuidados pessoais.",
                action: "Ver produtos",
                image: "imagem/higiene_pessoal.png",
                alt: "Produtos de higiene pessoal"
            },
            {
                title: "Cuidados com os cabelos",
                highlight: "beleza e cuidado na sua rotina!",
                description: "Shampoos, condicionadores e tratamentos para seus cabelos.",
                action: "Ver produtos",
                image: "imagem/cuidados_cabelos.png",
                alt: "Produtos para cuidados com os cabelos"
            },
            {
                title: "Higiene bucal",
                highlight: "um sorriso cuidado todos os dias!",
                description: "Escovas, cremes dentais e enxaguantes para toda a família.",
                action: "Ver produtos",
                image: "imagem/higiene_bucal.png",
                alt: "Produtos de higiene bucal"
            },
            {
                title: "Limpeza da casa",
                highlight: "praticidade para sua rotina!",
                description: "Desinfetantes, detergentes e limpadores para sua casa.",
                action: "Ver produtos",
                image: "imagem/banner_higiene_limpeza.png",
                alt: "Produtos para limpeza da casa"
            },
            {
                title: "Papel e descartáveis",
                highlight: "mais praticidade no seu dia!",
                description: "Itens essenciais para higiene, organização e cuidados domésticos.",
                action: "Ver produtos",
                image: "imagem/banner_higiene_limpeza.png",
                alt: "Produtos de higiene e limpeza"
            }
        ];

        let current = 0;
        let timer = null;
        const interval = 5000;

        function render(index) {
            current = (index + slides.length) % slides.length;
            const slide = slides[current];

            if (title) {
                title.innerHTML = slide.title + "<span>" + slide.highlight + "</span>";
            }

            if (description) description.textContent = slide.description;
            if (actionText) actionText.textContent = slide.action;

            if (image) {
                image.src = slide.image;
                image.alt = slide.alt;
            }

            dots.forEach(function (dot, indexDot) {
                dot.classList.toggle("active-dot", indexDot === current);
                dot.setAttribute("aria-current", indexDot === current ? "true" : "false");
            });
        }

        function next() {
            render(current + 1);
        }

        function previous() {
            render(current - 1);
        }

        if (leftButton) leftButton.addEventListener("click", previous);
        if (rightButton) rightButton.addEventListener("click", next);

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                render(index);
                restart();
            });
        });

        function start() {
            timer = setInterval(next, interval);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        function restart() {
            stop();
            start();
        }

        banner.addEventListener("mouseenter", stop);
        banner.addEventListener("mouseleave", start);

        banner.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                previous();
                restart();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                next();
                restart();
            }
        });

        render(0);
        start();
    });
})();
