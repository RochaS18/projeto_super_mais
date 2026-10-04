// ===== FORMULÁRIO DE CONTATO =====
const formularioContato = document.querySelector('#formulario-contato');

if (formularioContato) {
    // Mostra uma confirmação sem recarregar a página e limpa os campos.
    formularioContato.addEventListener('submit', (evento) => {
        evento.preventDefault();
        document.querySelector('#mensagem-formulario').textContent = 'Mensagem enviada! Em breve entraremos em contato.';
        formularioContato.reset();
    });
}