let idquiz = document.getElementById('quiz')
let presposta = document.querySelector('.presposta')
let divresposta = document.querySelector('.divresposta')
let grafico = document.querySelector('.grafico')
let us = document.querySelector('.flag-icon-us')
let cn = document.querySelector('.flag-icon-cn')
let gb = document.querySelector('.flag-icon-gb')
let de = document.querySelector('.flag-icon-de')
let jp = document.querySelector('.flag-icon-jp')
let br = document.querySelector('.flag-icon-br')
        
function checarResposta(event) {
    if ( event.target.classList.contains ('certo') ) {
        presposta.textContent = "Acertou ✅"
        console.log('Acertou')
    }
        else { 
            presposta.textContent = "Errou ❌"
        console.log('Errou')
    }
    
    divresposta.style.visibility = 'visible'
    idquiz.classList.add('inativo')
    us.classList.add('us')
    cn.classList.add('cn')
    gb.classList.add('gb')
    de.classList.add('de')
    jp.classList.add('jp')
    br.classList.add('br')
    grafico.classList.add('animagraf')
    event.target.classList.add('clicado')
}

let items = document.querySelectorAll('.item')

for (let item of items) {
    item.addEventListener( 'click', checarResposta)
}