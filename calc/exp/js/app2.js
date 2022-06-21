// Configuração das variáveis de uso global
let entrada = document.querySelector('input')
let botao = document.querySelector('.btnmostrar')
let blocos = document.querySelector('.blocos')
let marcador = document.querySelector('.voce')
let card = document.querySelector('#card-i')
let cardv = document.querySelector('#card-v')
let grafico = document.querySelector('#grafico')

// async () => (await (await fetch('https://github.todearaujo.com/interativos/calc/exp/geracoes.json')).json());

let arquivo = 'https://github.todearaujo.com/interativos/calc/exp/geracoes2.json'
let geracoes = [
  {
      "nome": "Perdida",
      "inicio": 1883,
      "fim": 1900,
      "texto": "<b>Geração Perdida<br>(1833 - 1900)</b><br><br>Nascidos durante o século 19, os <i>perdidos</i> passaram pela Primeira Guerra Mundial, mas também curtiram muito os <i>Loucos Anos 20</i>, já no séc. XX.<br><br>Cunhado pela poetisa americana Gertrude Stein, o nome alude ao sentimento de desorientação germinado no pós-guerra, um dos traços mais marcantes dessa geração.",
      "aos18": {
          "p": 1901,
          "u": 1918
      },
      "aos70": {
          "p": 1953,
          "u": 1970
      },
      "fatos": [
          {
              "nome": "Primeira Guerra Mundial",
              "inicio": 1914,
              "fim": 1918
          },
          {
              "nome": "Segunda Guerra Mundial",
              "inicio": 1939,
              "fim": 1945
          }
      ]
  },
  {
      "nome": "Grandiosa",
      "inicio": 1901,
      "fim": 1927,
      "texto": "<b>Geração Grandiosa<br>(1901 - 1927)</b><br><br>É a geração que passou pela Segunda Guerra Mundial e viveu o período conhecido como a Grande depressão, em inglês <i>(Greatest depression)</i>.<br><br>Batizada pelo jornalista americano Tom Brokaw, o nome da geração é referência direta ao termo em inglês <i>greatest</i>."
  },
  {
      "nome": "Silenciosa",
      "inicio": 1928,
      "fim": 1945,
      "texto": "<b>Geração Silenciosa<br>(1928 - 1945)</b><br><br>Uma referência explícita ao comportamento conformista que marcou a geração, em sua maioria, principalmente enquanto jovens.<br><br>Na idade adulta, os <i>silenciosos</i> presenciaram a Guerra da Coreia, o nascimento do rock nos anos 50 e os movimentos de direitos civis nos anos 60."
  },
  {
      "nome": "Baby Boomers",
      "inicio": 1946,
      "fim": 1964,
      "texto": "<b>Baby Boomers<br>(1946 - 1964)</b><br><br>Nascidos aos montes após a Segunda Guerra Mundial durante um <i>boom</i> populacional que marcou a época, por isso <i>boomers</i>.<br><br>Enquanto jovens, participaram dos movimentos de contracultura dos anos 60, questionando muitos dos valores vigentes na época."
  },
  {
      "nome": "Geração X",
      "inicio": 1965,
      "fim": 1980,
      "texto": "<b>Geração X<br>(1965 - 1980)</b><br><br>Nascidos entre meados dos anos 60 até o ano de 1980, a geração foi marcada por mudanças nos valores sociais como o aumento no número de divórcios e o 'retorno das mães' à força de trabalho em 'jornada dupla'.<br><br>Enquanto adolescentes e jovens adultos nos anos 80/90, os 'X' também ficaram conhecidos como 'geração MTV'. É uma referência ao canal americano que popularizou os videoclipes musicais, também outro traço marcante da época."
  },
  {
      "nome": "Y / Millennials",
      "inicio": 1981,
      "fim": 1996,
      "texto": "<b>Geração Y<br>Millennials<br>(1981 - 1996)</b><br><br>Costumam ser filhos únicos ou com apenas um irmão, os <i>millennials</i> são a geração em que pesquisadores enxergaram pela primeira vez comportamentos sincronizadamente parecidos em nível global.<br><br>Foram pioneiros nos comportamentos de 'nativos digitais'. É por isso que o nome faz referência ao momento em que se tornaram adolescentes e jovens adultos, durante a virada dos anos 2000, marcada na tecnologia pelo <i>bug do milênio</i>."
  },
  {
      "nome": "Z / Zoomers",
      "inicio": 1997,
      "fim": 2012,
      "texto": "<b>Geração Z<br>Zoomers<br>(1997 - 2012)</b><br><br>São os primeiros a nascerem verdadeiros <i>nativos digitais</i>. O nome faz referência direta aos <i>baby boomers</i>, por conta similaridades comportamentais entre o passado e os 'Z'.<br><br>São avessos aos riscos, e assim, mais <i>comportados</i> que seus antecessores - a geração dos <i>millennials</i>.<br><br>Um dos traços mais marcantes é que os <i>zoomers</i> foram pioneiros em passar mais tempo nas telas do que interagindo com objetos de '<i>papel</i>'."
  },
  {
      "nome": "Alpha",
      "inicio": 2013,
      "fim": 2025,
      "texto": "<b>Geração Alpha<br>(2013 - 2025)</b><br><br>Primeiros a nascer integralmente no século 21, os <i>alpha</i> são em sua maioria filhos da geração <i>millennial</i>.<br><br>Seu nome ainda está em disputa pelos estudiosos, pois alguns acreditam que a covid-19 é o marco fundamental da geração, migrando então para a letra 'C'."
  }
]

// fetch( arquivo ).then( resposta => resposta.json() ).then( gjson )

// Dois trechos de código que criam os elemetnos que compoem a section em grid que contém 
// o gráfico. Este primeiro cria, para cada entrada no intervalo das gerações, uma div nova.
// Cada uma contém os elementos de data de início da geração e o respectivo nome. Uma das linhas
// faz o o cálculo do tamanho que a div deve ter para que fique proporcional no dispositivo. Outra
// linha coloca o nome da geração dentro da div. Para o atributo data-inicio é enviado o ano de início
// da geração. Este dado é consumido no CSS em um bloco com a declaração ::before.
let blocosgeracoes = () => {
  for ( let geracao of geracoes ){
    let bloco = document.createElement( 'div' )
    bloco.setAttribute('data-inicio', geracao.inicio)
    bloco.setAttribute('data-fim', geracao.fim)
    bloco.style.height = (geracao.fim - geracao.inicio) + '%' 
    blocos.appendChild( bloco ) 
    bloco.innerHTML = '<a class="nomegeracao">' + geracao.nome + '</a>'
  }
}

blocosgeracoes()

// Este segundo trecho faz o mesmo: para cada valor no intervalo, uma nova div. É uma segunda section
// que compartilha o mesmo nome de grid-area. É assim que elas ficam sobrepostas e por isso precisam
// ter as divs de mesmo tamanho - o código até aí então é o mesmo. Na última linha é definido que o destino
// das divs é a seção de ID voce. Nomeei assim, pois é onde ficam o marcador que mostra o ano de nascimento
// inserido pelo usuário.
for ( let geracao of geracoes ) {
  let bloco = document.createElement( 'div' )
  bloco.style.height = (geracao.fim - geracao.inicio) + '%'
  marcador.appendChild( bloco )
}

// Configurão de escutador do elemento entrada. Ele checa o preenchimetno de
// texto em um input, executando para cada novo digito inserido a validação do ano inserido.

entrada.addEventListener('input', validar)

// Configuração do botão de cálculo para que começe desativado e,
// em combinação com o css, o torne invisível.
botao.disabled = true

// Abaixo, o código pergunta para o mesmo escutador de entrada se ele ouviu algum
// botão ser pressionado no teclado - desktop ou celular.
entrada.addEventListener('keypress', (event) => {
// Se for pressionada uma tecla, a função checa duas condições: primeiro se a tecla
// pressionada foi 'Enter'; e segundo, se o botão de cáculo está visiível.
// Para que esta última condição seja verdade, a função na página já confirmou
// que o input foi preenchido por um número do ano válido: é inteiro está no
// intervalo descrito nos dados.
  if (botao.disabled == false && event.key === 'Enter'){
    calcular(validar())
// Quando essas duas condições são verdadeiras, é feito então o cálculo
// de posicionamento do marcador de nascimento.
  }
});


// Função validar checa: 1. entrada input tem um valor de preenchimento.
// 2. É maior ou igual do que 1882 e menor ou igual a 2026.
function validar() {
 
  let anonasc = parseInt( entrada.value, 10 )
  // Converte o anonasc em um valor inteiro (número)
  
  if ( isNaN( anonasc ) || anonasc <= 1882 || anonasc >= 2026 ) {
  // Checa condições descritas acima. Se verdadeira, reseta as configurações
  // do gráfico e ativa o botão de calcular. Se for falso, mantém tudo como está.
      limpar()
      botao.disabled = true;
    }
  else { 
      botao.disabled = false;
    }
return anonasc
}

// Função de cálculo. O parâmetro é o valor do número validado pela função acima.
function calcular( anonasc ) {

  // Define o índice de gerações como o intervalo dos valores + 1.
  let indice = geracoes.length + 1
  
  for ( let geracao of geracoes ) {
  // Loop pelo intervalo de gerações, em que a primeira linha
  // é uma instrução para diminuir em uma unidade para cada geração iterada.
  indice--
  
    if ( anonasc <= geracao.fim ) {
      // Quando o valor do ano inserido for menor ou igual
      // ao ano em que termina uma geração (geracao.fim),
      // definir variáveis a serem destacadas de acordo com
      // o valor do índice correspondente à geração e ao anonasc
      // inserido no input no início da experiência.
      let texto = geracao.texto
      let numerobloco = geracoes.length - indice
      let voce = 100 - ( ( geracao.fim - anonasc ) * 100 / ( geracao.fim - geracao.inicio ) )
      destacarBloco( numerobloco, texto )
      posicaoMarcador( numerobloco, anonasc, voce )
      break
    }
  }

}

// Função que destaca a geração correspondente ao número do índice
// inserindo as informações calculadas de acordo com o número do ano
// informado pelo usuário no campo de input.
function destacarBloco( numerobloco, texto ) {

  let blocosgrafico = document.querySelectorAll( '.blocos > div' )
  let indice = -1
  
  for ( let bloco of blocosgrafico ) {
    ++indice
    if ( indice == numerobloco ) {
    bloco.classList.add( 'mostrar' )
    bloco.setAttribute('onclick', 'explorarGeracao(' + numerobloco + ')')
    bloco.style.cursor = 'pointer'
    cardv.innerHTML = '<div>' + texto + '</div>'
    // Iniciar a função que desliza a visualização do viewport
    // para o bloco da geração correspondente ao valor inserido.
    mostraSecao(bloco)
    }
  }

}

// Função que movimenta o marcador com
// o ano de nascimento informado pelo usuário.
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

// Função que reseta a calculadora para seu estado inicial.
function limpar() {

  let blocosgrafico = document.querySelectorAll( '.blocos > div' )
  let blocosmarcador = document.querySelectorAll( '.voce > div' )
  let mostrar = document.querySelector('.blocos > div.mostrar');

  for ( let bloco of blocosgrafico ) {
    card.classList.remove( 'virar' )
    bloco.classList.remove( 'mostrar')
    bloco.removeAttribute('onclick')
    mostrar.style.height = mostrar.dataset.fim - mostrar.dataset.inicio + '%'
    bloco.style.display = 'grid'
    bloco.style.cursor = 'auto'
  }

  for ( let marcador of blocosmarcador ) {
    marcador.classList.remove( 'mostrar')
    marcador.innerHTML = ''
  }

}

// Define a função que desliza a visualização do viewport
// para o bloco da geração correspondente ao valor inserido.
function mostraSecao( secao ) {
  secao.scrollIntoView( { behavior: "smooth" } );
}

// Define variáveis e função para observar quando o terceiro slide
// estive em foco no viewport do usuário, acionando a virada do card.
const infostalker = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('virar');
    return;
    }
  entry.target.classList.remove('virar');
  });
});

infostalker.observe(card);

function explorarGeracao(n) {

  console.log('Explorar ' + n)
 

  let excetomostrar = document.querySelectorAll('.blocos > div:not([class="mostrar"])')
  let blocosgrafico = document.querySelectorAll('.blocos > div')
  let mostrar = blocosgrafico[n]
  // let mostrarme1 = blocosgrafico[n-1]
  // let mostrarma1 = blocosgrafico[n+1]
  
  for ( let bloco of excetomostrar ) {
    bloco.style.display = 'none'
  }

  mostrar.style.height = 100 + '%'
  mostrar.style.cursor = 'auto'
  mostrar.removeAttribute('onclick')

}