let entrada = document.querySelector( 'input' )
let preenchimento = document.querySelector( '.preenchimento' )
let baldes = document.querySelector( '.baldes' )

// let arquivo = 'pnad-renda-2020.json'
let geracoes = [
  {
    "nome": 'Perdida',
    "tamanhorev": 15,
    "aterev": 2012,
    "limiteSuperior": 1883
  },
  {
    "nome": 'Grandiosa',
    "tamanhorev": 15,
    "aterev": 1997,
    "limiteSuperior": 1901
  },
  {
    "nome": 'Silenciosa',
    "tamanhorev": 15,
    "aterev": 1981,
    "limiteSuperior": 1928
  },
  {
    "nome": 'Baby Boomers',
    "tamanhorev": 15,
    "aterev": 1965,
    "limiteSuperior": 1946
  },
  {
    "nome": 'X',
    "tamanhorev": 18,
    "aterev": 1946,
    "limiteSuperior": 1965
  },
  {
    "nome": 'Y Millenials',
    "tamanhorev": 17,
    "aterev": 1928,
    "limiteSuperior": 1981
  },
  {
    "nome": 'Z Zoomers',
    "tamanhorev": 26,
    "aterev": 1901,
    "limiteSuperior": 1997
  },
  {
    "nome": 'Alpha',
    "tamanhorev": 7,
    "aterev": 1833,
    "limiteSuperior": 2012
  }
]

geracoes.reverse()

criarBaldes( geracoes )

function criarBaldes( geracoes ) {
  for ( let geracao of geracoes ) {
    let tamanho = geracao.tamanhorev
    
    let balde = document.createElement( 'div' )
    balde.style.width = tamanho + '%'
    // balde.setAttribute('data-de', geracao.de)
    balde.setAttribute('data-ate', geracao.aterev)
    baldes.appendChild( balde )
  }
}

function destacarBalde( numero, geracao ) {

  let baldes = document.querySelectorAll( '.baldes > div' )
  let indice = 0

  for ( let balde of baldes ) {

    balde.classList.remove( 'voce' )

    if ( indice === numero )
      balde.classList.add( 'voce' )
      console.log(geracao)
      balde.setAttribute('data-before', geracao)

    indice++
  }

}
 
function validar() {

  let valor = parseInt( entrada.value )
  
  if ( isNaN( valor ) || valor < 1883 )
    limpar()
  else
    calcular( valor )

}

function calcular( valor ) {

  let indice = 0

  for ( let geracaon of geracoes ) {

    if ( valor >= geracaon.limiteSuperior ) {

      let geracao = geracaon.nome

      let numero = geracoes.length - indice - 1
      
      console.log('Geração ' + geracaon.nome + ' e número ' + numero)

        destacarBalde( numero, geracao )

      break

    }
    indice++
  }

}

function limpar() {

  let baldes = document.querySelectorAll( '.baldes > div' )
  let indice = 0

  for ( let balde of baldes ) {
    balde.classList.remove( 'voce')
    indice++
  }

}

entrada.addEventListener('input', validar)