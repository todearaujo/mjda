let entrada = document.querySelector( 'input' )
let preenchimento = document.querySelector( '.preenchimento' )
let blocos = document.querySelector( '.blocos' )

// let arquivo = 'pnad-renda-2020.json'
let geracoes = [
  {
    "nome": 'Perdida',
    "tamanhorev": 15,
    "derev": 2012,
    "limiteSuperior": 1883
  },
  {
    "nome": 'Grandiosa',
    "tamanhorev": 15,
    "derev": 1997,
    "limiteSuperior": 1901
  },
  {
    "nome": 'Silenciosa',
    "tamanhorev": 15,
    "derev": 1981,
    "limiteSuperior": 1928
  },
  {
    "nome": 'Baby Boomers',
    "tamanhorev": 15,
    "derev": 1965,
    "limiteSuperior": 1946
  },
  {
    "nome": 'Geração X',
    "tamanhorev": 18,
    "derev": 1946,
    "limiteSuperior": 1965
  },
  {
    "nome": 'Y Millenials',
    "tamanhorev": 17,
    "derev": 1928,
    "limiteSuperior": 1981
  },
  {
    "nome": 'Z Zoomers',
    "tamanhorev": 26,
    "derev": 1901,
    "limiteSuperior": 1997
  },
  {
    "nome": 'Alpha',
    "tamanhorev": 7,
    "derev": 1833,
    "limiteSuperior": 2012
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

function destacarBalde( numero, geracao ) {

  let blocos = document.querySelectorAll( '.blocos > div' )
  let indice = 0

  for ( let bloco of blocos ) {

    bloco.classList.remove( 'selecionada' )

    if ( indice === numero )
      bloco.classList.add( 'selecionada' )
      bloco.setAttribute('data-before', geracao)

    indice++
  }

}
 
function validar() {

  let valor = parseInt( entrada.value )
  
  if ( isNaN( valor ) || valor <= 1882 )
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

  let blocos = document.querySelectorAll( '.blocos > div' )
  let indice = 0

  for ( let bloco of blocos ) {
    bloco.classList.remove( 'selecionada')
    indice++
  }

}

entrada.addEventListener('input', validar)