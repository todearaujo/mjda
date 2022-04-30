let idquiz = document.getElementById('quiz')
let presposta = document.querySelector('.presposta')
let divresposta = document.querySelector('.divresposta')
let grafico = document.querySelector('.grafico')
let us = document.querySelector('.flag-icon-us')
let cn = document.querySelector('.flag-icon-cn')
let gb = document.querySelector('.flag-icon-gb')
        
function checarResposta(event) {
    if ( event.target.classList.contains ('certo') ) {
        presposta.textContent = "Acertou ✅"
        console.log('Acertou')
    }
        else { 
            presposta.textContent = "Errou ❌"
        console.log('Errou')
    }
    
    divresposta.style.display = 'block'
    idquiz.classList.add('inativo')
    us.classList.add('us')
    cn.classList.add('cn')
    gb.classList.add('gb')
    grafico.classList.add('animagraf')
    event.target.classList.add('clicado')
}

let items = document.querySelectorAll('.item')

for (let item of items) {
    item.addEventListener( 'click', checarResposta)
}