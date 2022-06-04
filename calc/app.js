let entrada = document.querySelector('input')
let botao = document.querySelector('.btnmostrar')
let blocos = document.querySelector('.blocos')
let marcador = document.querySelector('.voce')
let card = document.querySelector('#card-i')
let cardv = document.querySelector('#card-v')
let grafico = document.querySelector('#grafico')

let geracoes = [
  {
    "nome": 'Perdida',
    "de": 1883,
    "ate": 1900,
    "texto": '<b>Geração Perdida<br>(1833 - 1900)</b><br><br>Os <i>perdidos</i> passaram pela Primeira Guerra Mundial e viveram os <i>Loucos Anos 20</i>.<br><br>Cunhado pela poetisa americana Gertrude Stein, o nome alude ao sentimento de desorientação que marcou essa geração.'
  },
  {
    "nome": 'Grandiosa',
    "de": 1901,
    "ate": 1927,
    "texto": '<b>Geração Grandiosa<br>(1901 - 1927)</b><br><br>Passaram pela Segunda Guerra Mundial e viveram a <i><b>Grande depressão (Greatest depression)</b></i> e os <i>Trinta Anos Gloriosos</i>.<br><br>Cunhado pelo jornalista americano Tom Brokaw, o nome é uma direta referência ao termo em inglês <i>greatest</i>.'
  },
  {
    "nome": 'Silenciosa',
    "de": 1928,
    "ate": 1945,
    "texto": '<b>Geração Silenciosa<br>(1928 - 1945)</b><br><br>O termo se refere ao comportamento conformista da geração, principalmente enquanto jovens, em sua maioria.<br><br>Na idade adulta, os <i>silenciosos</i> presenciaram a Guerra da Coreia, o nascimento do rock nos anos 50 e os movimentos de direitos civis nos anos 60.'
  },
  {
    "nome": 'Baby Boomers',
    "de": 1946,
    "ate": 1964,
    "texto": 'Baby Boomers'
  },
  {
    "nome": 'Geração X',
    "de": 1965,
    "ate": 1980,
    "texto": 'Geração X'
  },
  {
    "nome": 'Y Millenials',
    "de": 1981,
    "ate": 1996,
    "texto": 'Millenials'
  },
  {
    "nome": 'Z Zoomers',
    "de": 1997,
    "ate": 2012,
    "texto": 'Zoomers' 
  },
  {
    "nome": 'Alpha',
    "de": 2013,
    "ate": 2025,
    "texto": 'Alpha'
  }
]

for ( let geracao of geracoes ) {
  let bloco = document.createElement( 'div' )
  bloco.style.height = Math.round(( ( ( ( 1 + geracao.ate ) - geracao.de ) * 100 ) / 143 )) + '%' 
  bloco.setAttribute('data-de', geracao.de)
  blocos.appendChild( bloco ) 
}

for ( let geracao of geracoes ) {
  let bloco = document.createElement( 'div' )
  bloco.style.height = Math.round(( ( ( ( 1 + geracao.ate ) - geracao.de ) * 100 ) / 143 )) + '%' 
  marcador.appendChild( bloco ) 
}

entrada.addEventListener('input', validar)
botao.disabled = true

function validar() {
 
  let anonasc = parseInt( entrada.value )

  if ( isNaN( anonasc ) || anonasc <= 1882 || anonasc >= 2026 ) {
      limpar()
      botao.disabled = true;
    }
  else { 
      calcular( anonasc )
      botao.disabled = false;
    }
  }

function mostraSecao( secao ) {
  secao.scrollIntoView( { behavior: "smooth" } );
}

function calcular( anonasc ) {

  //Define o índice de geração o tamanho 
  let indice = geracoes.length + 1
  
  for ( let geracao of geracoes ) {
  //Para cada geração (geracao) no índice de geracoes
  indice--
  
    if ( anonasc <= geracao.ate ) {
      //Quando o valor inserido for menor ou igual ao ano
      //em que termina uma geração (ate)
      let nomegeracao = geracao.nome
      //Definir variável geracao como o 'nome' da geração correspondente
      let texto = geracao.texto
      //Definir variável texto como o 'texto' da geração correspondente
      let numerobloco = geracoes.length - indice
      //Definir numero como total de gerações menos o índice atual - 1,
      //pois os blocos começam a contagem no 0
      let voce = 100 - ( ( geracao.ate - anonasc ) * 100 / ( geracao.ate - geracao.de ) )
      destacarBloco( numerobloco, nomegeracao, texto )
      posicaoMarcador( numerobloco, anonasc, voce )
      break
    }
  }

}

function destacarBloco( numerobloco, nomegeracao, texto ) {

  let blocosgrafico = document.querySelectorAll( '.blocos > div' )
  let indice = -1
  
  for ( let bloco of blocosgrafico ) {
    ++indice
    if ( indice == numerobloco ) {
    bloco.classList.add( 'mostrar' )
    bloco.innerHTML = '<div id="nomegeracao">' + nomegeracao + '</div>'
    cardv.innerHTML = '<div>' + texto + '</div>'
    }
  }

}

function posicaoMarcador( numerobloco, anonasc, voce ) {

  let blocosmarcador = document.querySelectorAll( '.voce > div' )
  let indice = -1
  
  for ( let marcador of blocosmarcador ) {
    ++indice
    if ( indice == numerobloco ) {
    marcador.classList.add( 'mostrar' )
    marcador.innerHTML = '<div id="marcador" style="height:' + voce + '%;">' + anonasc + '</div>'   
    }
  }

}

function limpar() {

  let blocosgrafico = document.querySelectorAll( '.blocos > div' )
  let blocosmarcador = document.querySelectorAll( '.voce > div' )

  for ( let bloco of blocosgrafico ) {
    bloco.classList.remove( 'mostrar')
    card.classList.remove( 'virar' )
    bloco.innerHTML = ''
  }

  for ( let marcador of blocosmarcador ) {
    marcador.classList.remove( 'mostrar')
    marcador.innerHTML = ''
  }

}

const stalker = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('virar');
    return;
    }
  entry.target.classList.remove('virar');
  });
});

stalker.observe(card);