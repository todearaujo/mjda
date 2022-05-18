function escutaScroll(event){
    
    let slides = document.querySelectorAll('[data-sn*="s"]');

    for(let slide of slides){
       
        let posicao = slide.getBoundingClientRect();

        let target = slide.dataset.sn;

        let phone = document.querySelector('.'+target);
        let tamanho = document.querySelector('.t'+target);   

        if(posicao.top <= 0 && posicao.top > -posicao.height){
            phone.classList.add('show');
            tamanho.classList.add('show');
        }else{
            phone.classList.remove('show');
            tamanho.classList.remove('show');
        }
    }

}

// 2. pedir ao navegador para escutar 
// o evento de rolagem da página
window.addEventListener('scroll', escutaScroll);