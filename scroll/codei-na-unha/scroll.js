function atualizaViewport() {
    const altura = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    document.documentElement.style.setProperty('--viewport-height', `${altura}px`);
}

function atualizaProgresso(indice, total) {
    const progresso = document.querySelector('#progress strong');

    if (progresso) {
        progresso.textContent = `${indice + 1}/${total}`;
    }
}

function escutaScroll() {
    const slides = document.querySelectorAll('[data-sn*="s"]');
    const regua = document.querySelector('#phones');

    slides.forEach((slide, indice) => {
        const posicao = slide.getBoundingClientRect();
        const target = slide.dataset.sn;
        const phone = document.querySelector(`.${target}`);
        const tamanho = document.querySelector(`.t${target}`);

        if (!phone || !tamanho || !regua) {
            return;
        }

        if (posicao.top <= 0 && posicao.top > -posicao.height) {
            phone.classList.add('show');
            tamanho.classList.add('show');
            atualizaProgresso(indice, slides.length);

            if (target === 's00') {
                regua.classList.add('hideruler');
            } else if (target === 's16') {
                regua.classList.add('hideruler');
                document.querySelector('[data-sn="s16"]').style.visibility = 'visible';
            } else if (target === 's17') {
                regua.classList.add('hideruler');
                document.querySelector('[data-sn="s16"]').style.visibility = 'hidden';
            } else {
                regua.classList.remove('hideruler');
            }
        } else {
            phone.classList.remove('show');
            tamanho.classList.remove('show');
        }
    });
}

let viewportFrame;

function agendaViewport() {
    window.cancelAnimationFrame(viewportFrame);
    viewportFrame = window.requestAnimationFrame(() => {
        atualizaViewport();
        escutaScroll();
    });
}

atualizaViewport();
escutaScroll();

window.addEventListener('scroll', escutaScroll, { passive: true });
window.addEventListener('resize', agendaViewport);
window.addEventListener('orientationchange', agendaViewport);

if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', agendaViewport);
}
