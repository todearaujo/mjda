
const quiz = document.getElementById('quiz')
const card = document.getElementById('card')
let trivia = document.getElementById('trivia')
let question = document.getElementById('question')
const rightwrong = document.getElementById('rightwrong')
const valuesid = document.getElementById('values')
const values = document.querySelectorAll('#values > div')
const flags = document.querySelectorAll('#graph>div>div')
const flagGB = document.querySelector('.flag-icon-gb')
const flagUS = document.querySelector('.flag-icon-us')
const flagDE = document.querySelector('.flag-icon-de')
const flagJP = document.querySelector('.flag-icon-jp')
const flagCN = document.querySelector('.flag-icon-cn')
const flagBR = document.querySelector('.flag-icon-br')
const next = document.getElementById('next')
const back = document.getElementById('back')

qn = 0
question.dataset.quest = ( 'q' + (qn+1) )

for (let flag of flags) {
    flag.addEventListener('click', ask)
}

function nextquest () {
    
    question.dataset.quest = ( 'q' + (qn+1) )

    //reativa a área de clique
    quiz.classList.remove('desactive')

    card.classList.remove('show')

    for (let flag of flags) {
        flag.classList.remove('show')
    }    
}
       
function ask ( event ) {

    qn += 1

    //prepara as opções e valores de resposta
    for (let flag of flags) {
        flag.dataset.quest = ('q' + qn)
    }

    //prepara o texto da resposta e o botão de próxima
    trivia.dataset.quest = ('q' + qn)
    next.dataset.quest = ('q' + qn)
    back.dataset.quest = ('q' + qn)

    console.log("Checar a resposta para pergunta Q" + qn)
    for (let flag of flags) {

        if ( flag.dataset.quest === ('q1') ) {  
            flagUS.classList.add('right')  
        }
        else if ( flag.dataset.quest === ('q2') ) {
            flagUS.classList.remove('right')  
            flagCN.classList.add('right')  
        }
        else if ( flag.dataset.quest === ('q3') ) {
            flagCN.classList.remove('right')  
            flagBR.classList.add('right')  
        }
        else if ( flag.dataset.quest === ('q4') ) {
            flagBR.classList.remove('right')  
            flagUS.classList.add('right')  
        }
        else if ( flag.dataset.quest === ('q5') ) {
            flagUS.classList.remove('right')  
            flagCN.classList.add('right')  
        }
    }
   
    if ( event.target.classList.contains ('right') ) {
        rightwrong.textContent = "Acertou ✅"
    }
        else { 
        rightwrong.textContent = "Errou ❌"
    }
    
    //make quiz unclickable
    quiz.classList.add('desactive')

    //fade in answers components
    card.classList.add('show')

    for (let flag of flags) {
        flag.classList.add('show')
    }
}