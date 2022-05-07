//Declaração de elementos na ordem em que aparecem também no HTML

const trivia = document.getElementById('trivia')
const rightwrong = document.getElementById('rightwrong')
console.log("Seção 'Card' OK")

const quiz = document.getElementById('quiz')
const question = document.getElementById('question')
const flags = document.querySelectorAll('#graph>div>div')
const values = document.querySelectorAll('#values > div')
console.log("Seção 'Quiz' OK")

const f ={
    GB: document.querySelector('.flag-icon-gb'),
    US: document.querySelector('.flag-icon-us'),
    DE: document.querySelector('.flag-icon-de'),
    JP: document.querySelector('.flag-icon-jp'),
    CN: document.querySelector('.flag-icon-cn'),
    BR: document.querySelector('.flag-icon-br')
}
console.log("Bandeiras OK")

const buttons ={
    section: document.getElementById('buttons'),
    next: document.getElementById('next'),
    back: document.getElementById('back')
}
console.log("Navegação OK")

//Declara variável QN, que movimenta os seletores
qn = 0
console.log("Configurou o seletor na posição 0")

//Começa o quiz na pergunta 1
question.dataset.quest = ( 'q' + (qn+1) )
console.log("Exibiu a pergunta 1")

//Instala área clicável
for (let flag of flags) {
    flag.addEventListener('click', ask)
}

function nextquest () {

    //Move seletor
    question.dataset.quest = ( 'q' + (qn+1) )
    console.log("Avançou o seletor. Exibiu a pergunta " + qn)
    
    //Ativa cliques
    quiz.classList.remove('desactive')
    console.log("Reativou cliques no quiz")

    //Esconde elementos
    rightwrong.classList.remove('show')
    trivia.classList.remove('show')
    buttons.section.classList.remove('show')
    for (let flag of flags) {
        flag.classList.remove('show')
    }
    console.log("Escondeu respostas e navegação")
}
console.log("Função próxima pergunta está ativa. Aguardando primeira resposta.")
       
function ask ( event ) {

    //Avança variável QN
    qn += 1
    console.log("Pergunta Q" + qn + " está ativa")

    for (let flag of flags) {
        flag.dataset.quest = ('q' + qn)
    }
        
    trivia.dataset.quest = ('q' + qn)
    buttons.next.dataset.quest = ('q' + qn)
    buttons.back.dataset.quest = ('q' + qn)
    
    console.log("Bandeiras, resposta e navegação na posição " + qn)

        for (let flag of flags) {

        if ( flag.dataset.quest === ('q1') ) {  
            f.US.classList.add('right')
        }
        else if ( flag.dataset.quest === ('q2') ) {
            f.US.classList.remove('right')  
            f.CN.classList.add('right')  
        }
        else if ( flag.dataset.quest === ('q3') ) {
            f.CN.classList.remove('right')  
            f.BR.classList.add('right')  
        }
        else if ( flag.dataset.quest === ('q4') ) {
            f.BR.classList.remove('right')  
            f.US.classList.add('right')   
        }
        else if ( flag.dataset.quest === ('q5') ) {
            f.US.classList.remove('right')  
            f.CN.classList.add('right')  
        }  
    }
    console.log("Checou resposta " + qn)
   
    if ( event.target.classList.contains ('right') ) {
        rightwrong.textContent = "Acertou ✅"
        console.log("Acertou a pergunta" + qn)
    }
        else { 
        rightwrong.textContent = "Errou ❌"
        console.log("Errou a pergunta " + qn)
    }
    
    //Fade-in nos elementos de resposta
    rightwrong.classList.add('show')
    trivia.classList.add('show')
    buttons.section.classList.add('show')

    for (let flag of flags) {
        flag.classList.add('show')
    }

        //Desativa cliques nas bandeiras
        quiz.classList.add('desactive')
        console.log("Desativa cliques e aguarda 'Próxima pergunta'")
}