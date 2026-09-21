/* =========================================
   CARROSSEL PRINCIPAL - SUPER MAIS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const slides = [
        {
            categoria: "Alimentos",
            imagem: "imagem/alimentos.png",
            alt: "Produtos alimentícios",
            titulo: "Alimentos",
            descricao: "Tudo para as suas refeições do dia a dia",
            botao: "Ver produtos"
        },
        {
            categoria: "Doces e Sobremesas",
            imagem: "imagem/doces.png",
            alt: "Doces e sobremesas",
            titulo: "Doces e Sobremesas",
            descricao: "Os melhores doces para todos os momentos",
            botao: "Ver produtos"
        },
        {
            categoria: "Ferramentas e Construção",
            imagem: "imagem/ferramentas.png",
            alt: "Ferramentas e materiais de construção",
            titulo: "Ferramentas e Construção",
            descricao: "Do pequeno reparo à grande obra",
            botao: "Ver produtos"
        },
        {
            categoria: "Higiene e Limpeza",
            imagem: "imagem/higiene_limpeza.png",
            alt: "Produtos de higiene e limpeza",
            titulo: "Higiene e Limpeza",
            descricao: "Cuidados que fazem a diferença",
            botao: "Ver produtos"
        }
    ];

    const banner = document.querySelector(".banner");
    const bannerTitle = document.querySelector(".banner-title");
    const bannerDescription = document.querySelector(".banner-description");
    const bannerAction = document.querySelector(".banner-action-text");
    const bannerImage = document.querySelector(".banner-image");
    const bannerImageElement = document.querySelector(".banner-image img");

    const previousButton = document.querySelector(".slider-left");
    const nextButton = document.querySelector(".slider-right");
    const dots = document.querySelectorAll(".slider-dots button");

    if (
        !banner ||
        !bannerTitle ||
        !bannerDescription ||
        !bannerAction ||
        !bannerImage ||
        !bannerImageElement ||
        !previousButton ||
        !nextButton
    ) {
        return;
    }

    let currentSlide = 0;
    let autoPlay;

    function atualizarSlide(index, direction = 1) {
        currentSlide = (index + slides.length) % slides.length;

        const slide = slides[currentSlide];

        // Pequena transição para evitar troca "seca" do conteúdo.
        bannerTitle.classList.add("is-changing");
        bannerDescription.classList.add("is-changing");
        bannerAction.classList.add("is-changing");
        bannerImage.classList.add("is-changing");

        setTimeout(() => {
            bannerTitle.innerHTML = `${slide.titulo}<span>em um só lugar!</span>`;
            bannerDescription.textContent = slide.descricao;
            bannerAction.textContent = slide.botao;

            bannerImageElement.src = slide.imagem;
            bannerImageElement.alt = slide.alt;

            // Mantém a mesma composição visual e revela o novo slide.
            bannerTitle.classList.remove("is-changing");
            bannerDescription.classList.remove("is-changing");
            bannerAction.classList.remove("is-changing");
            bannerImage.classList.remove("is-changing");
        }, 180);

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active-dot", dotIndex === currentSlide);
        });

        banner.dataset.categoria = slide.categoria;
    }

    function proximoSlide() {
        atualizarSlide(currentSlide + 1, 1);
    }

    function slideAnterior() {
        atualizarSlide(currentSlide - 1, -1);
    }

    function iniciarAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = setInterval(proximoSlide, 6000);
    }

    previousButton.addEventListener("click", () => {
        slideAnterior();
        iniciarAutoPlay();
    });

    nextButton.addEventListener("click", () => {
        proximoSlide();
        iniciarAutoPlay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            atualizarSlide(index);
            iniciarAutoPlay();
        });
    });

    // Teclado: ← e → também navegam no banner.
    banner.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            slideAnterior();
            iniciarAutoPlay();
        }

        if (event.key === "ArrowRight") {
            proximoSlide();
            iniciarAutoPlay();
        }
    });

    // Pausa o avanço automático quando o mouse está sobre o banner.
    banner.addEventListener("mouseenter", () => clearInterval(autoPlay));
    banner.addEventListener("mouseleave", iniciarAutoPlay);

    // Estado inicial.
    atualizarSlide(0);
    iniciarAutoPlay();
});
