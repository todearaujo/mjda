let entrada = document.querySelector('input')
let preenchimento = document.querySelector('.preenchimento')
let blocos = document.querySelector('.blocos')
let card = document.querySelector('#card-i')

let geracoes = [
  {
    "nome": 'Perdida',
    "limiteSuperior": 1833,
    "tamanhorev": 15,
    "derev": 2012,
    "texto": 'Texto'
  },
  {
    "nome": 'Grandiosa',
    "limiteSuperior": 1901,
    "tamanhorev": 15,
    "derev": 1997,
    "texto": 'Texto'
  },
  {
    "nome": 'Silenciosa',
    "limiteSuperior": 1928,
    "tamanhorev": 15,
    "derev": 1981,
    "texto": 'Texto'
  },
  {
    "nome": 'Baby Boomers',
    "limiteSuperior": 1946,
    "tamanhorev": 15,
    "derev": 1965,
    "texto": 'Texto'
  },
  {
    "nome": 'Geração X',
    "limiteSuperior": 1965,
    "tamanhorev": 18,
    "derev": 1946
  },
  {
    "nome": 'Y Millenials',
    "limiteSuperior": 1981,
    "tamanhorev": 17,
    "derev": 1928
  },
  {
    "nome": 'Z Zoomers',
    "limiteSuperior": 1997,
    "tamanhorev": 26,
    "derev": 1901    
  },
  {
    "nome": 'Alpha',
    "limiteSuperior": 2012,
    "tamanhorev": 7,
    "derev": 1833
  }
]

geracoes.reverse()

criarBaldes( geracoes )

function criarBaldes( geracoes ) {
  for ( let geracao of geracoes ) {
    let tamanho = geracao.tamanhorev
    
    let bloco = document.createElement( 'div' )
    bloco.style.height = tamanho + '%'
    bloco.setAttribute('data-de', geracao.derev)
    blocos.appendChild( bloco )
  }
}

function destacarBloco( numero, geracao ) {

  let blocos = document.querySelectorAll( '.blocos > div' )
  let indice = 0

  for ( let bloco of blocos ) {

    bloco.classList.remove( 'mostrar' )
    card.classList.remove( 'virar' )

    if ( indice === numero )
      bloco.classList.add( 'mostrar' )
      card.classList.add( 'virar' )
      bloco.setAttribute('data-before', geracao)

    indice++
  }

}
 
function validar() {
 
  let valor = parseInt( entrada.value )

  if ( isNaN( valor ) || valor <= 1832 )
    limpar()
  else
    calcular( valor )
 
  }

function calcular( valor ) {

  //Define o índice de geração como 0
  let indice = 0
  
  for ( let geracaon of geracoes ) {
  //Para cada geração (geracaon) no índice de geracoes
    if ( valor >= geracaon.limiteSuperior ) {
      //Quando o valor inserido for maior ou igual ao ano
      //que se inicia uma geração (limiteSuperior)
      let geracao = geracaon.nome
      //Definir variável geracao como o 'nome'
      let numero = geracoes.length - indice - 1
      //Definir variável número como o 'nome'
      console.log('Geração ' + geracaon.nome + ' e número ' + numero)
        destacarBloco( numero, geracao )
      break
    }
    indice++
  }

}

function limpar() {

  let blocos = document.querySelectorAll( '.blocos > div' )
  let indice = 0

  for ( let bloco of blocos ) {
    bloco.classList.remove( 'mostrar')
    card.classList.remove( 'virar' )
    indice++
  }

}

entrada.addEventListener('input', validar)