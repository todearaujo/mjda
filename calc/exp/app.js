// Configuração das variáveis de uso global
let entrada = document.querySelector('input')
let botao = document.querySelector('.btnmostrar')
let blocos = document.querySelector('.blocos')
let marcador = document.querySelector('.voce')
let card = document.querySelector('#card-i')
let cardv = document.querySelector('#card-v')
let grafico = document.querySelector('#grafico')

// async () => (await (await fetch('https://github.todearaujo.com/interativos/calc/exp/geracoes2.json')).json());

let arquivo = 'https://github.todearaujo.com/interativos/calc/exp/geracoes.json'

fetch( arquivo ).then( resposta => resposta.json() ).then( resposta.geracoes ) 

console.log(geracoes)

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