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
    "texto": '<b>Geração Perdida<br>(1833 - 1900)</b><br><br>Os <i>perdidos</i> passaram pela Primeira Guerra Mundial e curtiram muito os <i>Loucos Anos 20</i>.<br><br>Cunhado pela poetisa americana Gertrude Stein, o nome alude ao sentimento de desorientação que marcou essa geração.'
  },
  {
    "nome": 'Grandiosa',
    "de": 1901,
    "ate": 1927,
    "texto": '<b>Geração Grandiosa<br>(1901 - 1927)</b><br><br>Passaram pela Segunda Guerra Mundial e viveram a Grande depressão <i>(Greatest depression)</i> e os <i>Trinta Anos Gloriosos</i>.<br><br>Cunhado pelo jornalista americano Tom Brokaw, o nome é uma direta referência ao termo em inglês <i>greatest</i>.'
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
    "texto": '<b>Baby Boomers<br>(1946 - 1964)</b><br><br>Nascidos após a segunda-guerra mundial em um <i>boom</i> populacional que marcou a época.<br><br>Enquanto jovens, os <i>boomer</i> participaram dos movimentos de contracultura em alguns países nos anos 60, questionando muitos valores.'
  },
  {
    "nome": 'Geração X',
    "de": 1965,
    "ate": 1980,
    "texto": '<b>Geração X<br>(1965 - 1980)</b><br><br>Nascidos entre meados dos anos 60 até o ano de 1980, a geração é marcada por mudanças nos valores sociais como o aumento no número de divórcios e o "retorno das mães" à força de trabalho.<br><br>Enquanto adolescentes e jovens adultos nos anos 80/90, os "X" também são chamados de "geração MTV", em referência ao canal musical e a invenção e popularização dos videoclipes.'
  },
  {
    "nome": 'Y / Millennials',
    "de": 1981,
    "ate": 1996,
    "texto": '<b>Geração Y<br>Millennials<br>(1981 - 1996)</b><br><br>Filhos únicos ou com um só irmão, <i>millenials</i> são da primeira geração encarada como fenômeno planetário, pois são filhos da globalização.<br><br>Pioneiros entre os "nativos digitais", o nome desta geração faz referência ao momento em que se tornaram adolescentes e jovens adultos na virada dos anos 2000.'
  },
  {
    "nome": 'Z / Zoomers',
    "de": 1997,
    "ate": 2012,
    "texto": '<b>Geração Z<br>Zoomers<br>(1997 - 2012)</b><br><br>Verdadeiros <i>nativos digitais</i>, o nome é uma referência aos <i>baby boomers</i>, por similaridades entre a geração do passado e os "Z".<br><br>Tem aversão à riscos e são mais <i>comportados</i> que seus antecessores. Esta é a primeira geração que passa mais tempo em telas do que com "papel".' 
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