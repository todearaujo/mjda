function escutaScroll(event){
    
    let slides = document.querySelectorAll('[data-sn*="s"]');

    for(let slide of slides){
       
        let posicao = slide.getBoundingClientRect();

        let target = slide.dataset.sn;

        let phone = document.querySelector('.'+target);

        if(posicao.top <= 0 && posicao.top > -posicao.height){
            // se sim, adiciona a classe que exibe o gráfico
            phone.classList.add('show');
        }else{
            // caso contrário, retire a classe
            phone.classList.remove('show');
        }
    }
}

// 2. pedir ao navegador para escutar 
// o evento de rolagem da página
window.addEventListener('scroll', escutaScroll);