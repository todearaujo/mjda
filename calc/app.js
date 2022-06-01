let entrada = document.querySelector('input')
let blocos = document.querySelector('.blocos')
let card = document.querySelector('#card-i')
let cardv = document.querySelector('#card-v')

let garray = [
  {
    "nome": 'Perdida',
    "limiteInferior": 1833,
    "tamanhorev": 15,
    "derev": 2012,
    "texto": 'Lutaram a Primeira Guerra e viveram os "Loucos Anos 20".<br><br>Nome da geração foi cunhado pela poetisa Gertrude Stein.'
  },
  {
    "nome": 'Grandiosa',
    "limiteInferior": 1901,
    "tamanhorev": 15,
    "derev": 1997,
    "texto": 'Grandiosa'
  },
  {
    "nome": 'Silenciosa',
    "limiteInferior": 1928,
    "tamanhorev": 15,
    "derev": 1981,
    "texto": 'Silenciosa'
  },
  {
    "nome": 'Baby Boomers',
    "limiteInferior": 1946,
    "tamanhorev": 15,
    "derev": 1965,
    "texto": 'Baby Boomers'
  },
  {
    "nome": 'Geração X',
    "limiteInferior": 1965,
    "tamanhorev": 18,
    "derev": 1946,
    "texto": 'Geração X'
  },
  {
    "nome": 'Y Millenials',
    "limiteInferior": 1981,
    "tamanhorev": 17,
    "derev": 1928,
    "texto": 'Millenials'
  },
  {
    "nome": 'Z Zoomers',
    "limiteInferior": 1997,
    "tamanhorev": 26,
    "derev": 1901,
    "texto": 'Zoomers' 
  },
  {
    "nome": 'Alpha',
    "limiteInferior": 2012,
    "tamanhorev": 7,
    "derev": 1833,
    "texto": 'Alpha'
  }
]

function criarBlocos( array ) {
  for ( let value of array ) {
    let tamanho = value.tamanhorev
    let bloco = document.createElement( 'div' )
    bloco.style.height = tamanho + 'vh'
    bloco.setAttribute('data-de', value.derev)
    blocos.appendChild( bloco )
  }
}

criarBlocos( garray.reverse() )
 
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
  console.log('Índice início calcular: ' + indice)
  
  for ( let ngeracao of garray ) {
  //Para cada geração (ngeracao) no índice de geracoes
  indice++
  
    if ( valor >= ngeracao.limiteInferior ) {
      //Quando o valor inserido for maior ou igual ao ano
      //que se inicia uma geração (limiteInferior)
      let nomegeracao = ngeracao.nome
      //Definir variável geracao como o 'nome' da geração correspondente
      let texto = ngeracao.texto
      //Definir variável texto como o 'texto' da geração correspondente
      console.log('Índice calcular: ' + indice)
      let numero = garray.length - indice
      //Definir numero como total de gerações menos o índice atual - 1,
      //pois os blocos começam a contagem no 0
      console.log('Geração ' + ngeracao.nome + ' e número ' + numero)
      destacarBloco( numero, nomegeracao, texto )
      break
    }
  }

}

function destacarBloco( numero, nomegeracao, texto ) {

  let blocosdivs = document.querySelectorAll( '.blocos > div' )
  let indice = 0

  for ( let bloco of blocosdivs ) {
    if ( indice === numero )
      bloco.classList.add( 'mostrar' )
      // card.classList.add( 'virar' )
      cardv.innerHTML = texto
      bloco.setAttribute('data-before', nomegeracao)
    indice++
  }

}

function limpar() {

  let blocosdivs = document.querySelectorAll( '.blocos > div' )

  for ( let bloco of blocosdivs ) {
    bloco.classList.remove( 'mostrar')
    card.classList.remove( 'virar' )
  }

}

entrada.addEventListener('input', validar)

const virarcard = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('virar');
    return;
    }
  entry.target.classList.remove('virar');
  });
});

virarcard.observe(card);