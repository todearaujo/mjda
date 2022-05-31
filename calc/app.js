let entrada = document.querySelector('input')
let preenchimento = document.querySelector('.preenchimento')
let blocos = document.querySelector('.blocos')
let card = document.querySelector('#card-i')
let cardv = document.querySelector('#card-v')

let geracoes = [
  {
    "nome": 'Perdida',
    "limiteSuperior": 1833,
    "tamanhorev": 15,
    "derev": 2012,
    "texto": 'Lutaram a Primeira Guerra e viveram os "Loucos Anos 20".<br><br>Nome da geração foi cunhado pela poetisa Gertrude Stein.'
  },
  {
    "nome": 'Grandiosa',
    "limiteSuperior": 1901,
    "tamanhorev": 15,
    "derev": 1997,
    "texto": 'Grandiosa'
  },
  {
    "nome": 'Silenciosa',
    "limiteSuperior": 1928,
    "tamanhorev": 15,
    "derev": 1981,
    "texto": 'Silenciosa'
  },
  {
    "nome": 'Baby Boomers',
    "limiteSuperior": 1946,
    "tamanhorev": 15,
    "derev": 1965,
    "texto": 'Baby Boomers'
  },
  {
    "nome": 'Geração X',
    "limiteSuperior": 1965,
    "tamanhorev": 18,
    "derev": 1946,
    "texto": 'Geração X'
  },
  {
    "nome": 'Y Millenials',
    "limiteSuperior": 1981,
    "tamanhorev": 17,
    "derev": 1928,
    "texto": 'Millenials'
  },
  {
    "nome": 'Z Zoomers',
    "limiteSuperior": 1997,
    "tamanhorev": 26,
    "derev": 1901,
    "texto": 'Zoomers' 
  },
  {
    "nome": 'Alpha',
    "limiteSuperior": 2012,
    "tamanhorev": 7,
    "derev": 1833,
    "texto": 'Alpha'
  }
]

geracoes.reverse()

criarBlocos( geracoes )

function criarBlocos( geracoes ) {
  for ( let geracao of geracoes ) {
    let tamanho = geracao.tamanhorev
    let bloco = document.createElement( 'div' )
    bloco.style.height = tamanho + '%'
    bloco.setAttribute('data-de', geracao.derev)
    blocos.appendChild( bloco )
  }
}

function destacarBloco( numero, geracao, texto ) {

  let blocos = document.querySelectorAll( '.blocos > div' )
  let indice = 0

  for ( let bloco of blocos ) {

    bloco.classList.remove( 'mostrar' )
    card.classList.remove( 'virar' )

    if ( indice === numero )
      bloco.classList.add( 'mostrar' )
      card.classList.add( 'virar' )
      cardv.innerHTML = texto
      bloco.setAttribute('data-before', geracao)

    indice++
  }

}
 
function validar() {
 
  let valor = parseInt( entrada.value )

  if ( isNaN( valor ) || valor <= 1832 || valor >= 2026 )
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
      //Definir variável geracao como o 'nome' da geração correspondente
      let texto = geracaon.texto
      //Definir variável texto como o 'texto' da geração correspondente
      let numero = geracoes.length - indice - 1
      //Definir numero como total de gerações menos o índice atual - 1,
      //pois os blocos começam a contagem no 0
      console.log('Geração ' + geracaon.nome + ' e número ' + numero)
        destacarBloco( numero, geracao, texto )
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