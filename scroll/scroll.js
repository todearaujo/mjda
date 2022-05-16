//a// 1. criar uma função para verificar 
// se o gatilho chegou ao topo da página
function escutaScroll(event){
    // A função deve...
    // Pegar a lista de gatilhos
    let scrollable = document.querySelectorAll("#scrollable > div");

    // A função deve...
    // Fazer loop pela lista de gatilhos
    for(let scroll of scrollable){
        // Para cada um deles, pegar a posição atual
        let posicao = scroll.getBoundingClientRect();
        // Para cada um deles, pegar o valor da propriedade data-alvo
        let target = scroll.dataset.slide;
        // Selecionar o elemento reference a este alvo
        let slide = document.querySelector('.'+target);
        // Verificar se o gatilho está acima do topo da página
        if(posicao.top <= 0 && posicao.top > -posicao.height){
            // se sim, adiciona a classe que exibe o gráfico
            slide.classList.add('pa');
        }else{
            // caso contrário, retire a classe
            slide.classList.remove('pa');
        }
    }
}

// 2. pedir ao navegador para escutar 
// o evento de rolagem da página
window.addEventListener('scroll', escutaScroll);