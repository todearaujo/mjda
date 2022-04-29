let prespostalet = document.querySelector('.presposta')
let divrespostalet = document.querySelector('.divresposta')
let idquiz = document.getElementById('quiz')
        
function checarResposta(event) {
    if ( event.target.classList.contains ('certo') ) {
        prespostalet.textContent = "Acertou ✅"
        console.log('Acertou')
    }
        else { 
        prespostalet.textContent = "Errou ❌"
        console.log('Errou')
    }
    
    divrespostalet.style.display = 'block'
    idquiz.classList.add('inativo')
    event.target.classList.add('clicado')
}

let items = document.querySelectorAll('.item')

for (let item of items) {
    item.addEventListener( 'click', checarResposta)
}