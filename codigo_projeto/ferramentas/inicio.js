// ===== CARROSSEL DE OFERTAS =====
// Só procura as ofertas quando o carrossel existe nesta página.
const carrossel = document.querySelector('.carrossel');

if (carrossel) {
    const ofertas = carrossel.querySelectorAll('.oferta');
    const pontos = carrossel.querySelectorAll('.ponto');
    const setaAnterior = carrossel.querySelector('.anterior');
    const setaProxima = carrossel.querySelector('.proxima');
    let ofertaAtual = 0;
    let intervaloCarrossel;

    // Ativa uma oferta e o ponto correspondente.
    function mostrarOferta(indice) {
        ofertaAtual = (indice + ofertas.length) % ofertas.length;

        ofertas.forEach((oferta, numero) => {
            oferta.classList.toggle('ativa', numero === ofertaAtual);
        });

        pontos.forEach((ponto, numero) => {
            ponto.classList.toggle('ativo', numero === ofertaAtual);
        });
    }

    // Troca a oferta a cada cinco segundos.
    function iniciarCarrossel() {
        clearInterval(intervaloCarrossel);
        intervaloCarrossel = setInterval(() => {
            mostrarOferta(ofertaAtual + 1);
        }, 5000);
    }

    // Os controles manuais também reiniciam o tempo do carrossel.
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