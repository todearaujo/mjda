let entrada = document.querySelector( 'input' )
let saida = document.querySelector( 'output' )
let preenchimento = document.querySelector( '.preenchimento' )
let baldes = document.querySelector( '.baldes' )

// let arquivo = 'pnad-renda-2020.json'
let geracoes = [
  {
    "nome": 'Perdida',
    "tamanhorev": 15,
    "de": 1883,
    "ate": 1900,
    "limiteSuperior": 1900
  },
  {
    "nome": 'Grandiosa',
    "tamanhorev": 15,
    "de": 1901,
    "ate": 1927,
    "limiteSuperior": 1901
  },
  {
    "nome": 'Silenciosa',
    "tamanhorev": 15,
    "de": 1928,
    "ate": 1945,
    "limiteSuperior": 1928
  },
  {
    "nome": 'Baby Boomers',
    "tamanhorev": 15,
    "de": 1946,
    "ate": 1964,
    "limiteSuperior": 1946
  },
  {
    "nome": 'Geração X',
    "tamanhorev": 18,
    "de": 1965,
    "ate": 1980,
    "limiteSuperior": 1965
  },
  {
    "nome": 'Y/Millenials',
    "tamanhorev": 17,
    "de": 1981,
    "ate": 1996,
    "limiteSuperior": 1981
  },
  {
    "nome": 'Z/Zoomers',
    "tamanhorev": 26,
    "de": 1997,
    "ate": 2012,
    "limiteSuperior": 1997
  },
  {
    "nome": 'Alpha',
    "tamanhorev": 7,
    "de": 2012,
    "ate": 2022,
    "limiteSuperior": 2012
  }
]

geracoes.reverse()

criarBaldes( geracoes )

function criarBaldes( geracoes ) {
  for ( let geracao of geracoes ) {
    let tamanho = geracao.tamanhorev
    console.log(tamanho)
    let balde = document.createElement( 'div' )
    balde.style.width = tamanho + '%'
    baldes.appendChild( balde )
  }
}

function destacarBalde( numero ) {

  let baldes = document.querySelectorAll( '.baldes > div' )
  let indice = 0

  for ( let balde of baldes ) {

    balde.classList.remove( 'voce' )

    if ( indice === numero )
      balde.classList.add( 'voce' )

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

function mostrar( nomegeracao ) {
  saida.textContent = nomegeracao
}

function calcular( valor ) {

  let indice = 0

  for ( let geracaon of geracoes ) {

    if ( valor >= geracaon.limiteSuperior ) {

      let geracao = geracaon.nome
      console.log(geracaon.nome)
      let numero = geracoes.length - indice - 1

      // if ( numero === 0 ) {
      //   limpar()
      // } else {
        destacarBalde( numero )
        mostrar( geracao )
      // }

      break

    }
    indice++
  }

}

function limpar() {

  saida.textContent = '…'

  let baldes = document.querySelectorAll( '.baldes > div' )
  let indice = 0

  for ( let balde of baldes ) {
    balde.classList.remove( 'voce', 'ativo' )
    indice++
  }

}

entrada.addEventListener('input', validar)