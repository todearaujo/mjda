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
    "texto": '<b>Geração Perdida<br>(1833 - 1900)</b><br><br>Nascidos durante o século 19, os <i>perdidos</i> passaram pela Primeira Guerra Mundial, mas também curtiram muito os <i>Loucos Anos 20</i>, já no séc. XX.<br><br>Cunhado pela poetisa americana Gertrude Stein, o nome alude ao sentimento de desorientação germinado no pós-guerra, um dos traços mais marcantes dessa geração.'
  },
  {
    "nome": 'Grandiosa',
    "de": 1901,
    "ate": 1927,
    "texto": '<b>Geração Grandiosa<br>(1901 - 1927)</b><br><br>É a geração que passou pela Segunda Guerra Mundial e viveu o período conhecido como a Grande depressão, em inglês <i>(Greatest depression)</i>.<br><br>Batizada pelo jornalista americano Tom Brokaw, o nome da geração é referência direta ao termo em inglês <i>greatest</i>.'
  },
  {
    "nome": 'Silenciosa',
    "de": 1928,
    "ate": 1945,
    "texto": '<b>Geração Silenciosa<br>(1928 - 1945)</b><br><br>Uma referência explícita ao comportamento conformista que marcou a geração, em sua maioria, principalmente enquanto jovens.<br><br>Na idade adulta, os <i>silenciosos</i> presenciaram a Guerra da Coreia, o nascimento do rock nos anos 50 e os movimentos de direitos civis nos anos 60.'
  },
  {
    "nome": 'Baby Boomers',
    "de": 1946,
    "ate": 1964,
    "texto": '<b>Baby Boomers<br>(1946 - 1964)</b><br><br>Nascidos aos montes após a Segunda Guerra Mundial durante um <i>boom</i> populacional que marcou a época, por isso <i>boomers</i>.<br><br>Enquanto jovens, participaram dos movimentos de contracultura dos anos 60, questionando muitos dos valores vigentes na época.'
  },
  {
    "nome": 'Geração X',
    "de": 1965,
    "ate": 1980,
    "texto": '<b>Geração X<br>(1965 - 1980)</b><br><br>Nascidos entre meados dos anos 60 até o ano de 1980, a geração foi marcada por mudanças nos valores sociais como o aumento no número de divórcios e o "retorno das mães" à força de trabalho em "jornada dupla".<br><br>Enquanto adolescentes e jovens adultos nos anos 80/90, os "X" também ficaram conhecidos como "geração MTV". É uma referência ao canal americano que popularizou os videoclipes musicais, também outro traço marcante da época.'
  },
  {
    "nome": 'Y / Millennials',
    "de": 1981,
    "ate": 1996,
    "texto": '<b>Geração Y<br>Millennials<br>(1981 - 1996)</b><br><br>Costumam ser filhos únicos ou com apenas um irmão, os <i>millennials</i> são a geração em que pesquisadores enxergaram pela primeira vez comportamentos sincronizadamente parecidos em nível global.<br><br>Foram pioneiros nos comportamentos de "nativos digitais". É por isso que o nome faz referência ao momento em que se tornaram adolescentes e jovens adultos, durante a virada dos anos 2000, marcada na tecnologia pelo <i>bug do milênio</i>.'
  },
  {
    "nome": 'Z / Zoomers',
    "de": 1997,
    "ate": 2012,
    "texto": '<b>Geração Z<br>Zoomers<br>(1997 - 2012)</b><br><br>São os primeiros a nascerem verdadeiros <i>nativos digitais</i>. O nome faz referência direta aos <i>baby boomers</i>, por conta similaridades comportamentais entre o passado e os "Z".<br><br>São avessos aos riscos, e assim, mais <i>comportados</i> que seus antecessores - a geração dos <i>millennials</i>.<br><br>Um dos traços mais marcantes é que os <i>zoomers</i> foram pioneiros em passar mais tempo nas telas do que interagindo com objetos de "<i>papel</i>".'
  },
  {
    "nome": 'Alpha',
    "de": 2013,
    "ate": 2025,
    "texto": '<b>Geração Alpha<br>(2013 - 2025)</b><br><br>Primeiros a nascer integralmente no século 21, os <i>alpha</i> são em sua maioria filhos da geração <i>millennial</i>.<br><br>Seu nome ainda está em disputa pelos estudiosos, pois alguns acreditam que a covid-19 é o marco fundamental da geração, migrando então para a letra "C".'
  }
]

for ( let geracao of geracoes ) {
  let bloco = document.createElement( 'div' )
  bloco.style.height = Math.round(( ( ( ( 1 + geracao.ate ) - geracao.de ) * 100 ) / 143 )) + '%' 
  bloco.setAttribute('data-de', geracao.de)
  blocos.appendChild( bloco ) 
  bloco.innerHTML = '<a class="nomegeracao">' + geracao.nome + '</a>'
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
      botao.disabled = false;
    }
return anonasc
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
      // let datadegeracao = ('[data-de="' + geracao.de + '"]')
      // let movgeracao = document.querySelector(datadegeracao)
      //Definir variável nomegeracao com o 'nome' da geração a ser destacada
      //Definir variável nomegeracaoid como o 'id' da bloco a ser destacado
      let texto = geracao.texto
      //Definir variável texto como o 'texto' da geração correspondente
      let numerobloco = geracoes.length - indice
      //Definir numero como total de gerações menos o índice atual - 1,
      //pois os blocos começam a contagem no 0
      let voce = 100 - ( ( geracao.ate - anonasc ) * 100 / ( geracao.ate - geracao.de ) )
      destacarBloco( numerobloco, texto )
      posicaoMarcador( numerobloco, anonasc, voce )
      break
    }
  }

}

function destacarBloco( numerobloco, texto ) {

  let blocosgrafico = document.querySelectorAll( '.blocos > div' )
  let indice = -1
  
  for ( let bloco of blocosgrafico ) {
    ++indice
    if ( indice == numerobloco ) {
    bloco.classList.add( 'mostrar' )
    cardv.innerHTML = '<div>' + texto + '</div>'
    mostraSecao(bloco)
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