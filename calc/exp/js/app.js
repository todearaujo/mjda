(async () => await fetch('geracoes.json').then(res => res.json()).then(async (dados) => {
  
// Configuração de variáveis de uso global
const entrada = document.querySelector('input');
const botcalcular = document.querySelector('#calcular');
const botlimpar = document.querySelector('#limpar');
const idsgeracoes = await dados.ids
const idsfatos = await dados.fatos

// Elementos do gráfico-timeline
const timeline = document.querySelector('#timeline');
const dividgeracoes = document.querySelector('#geracoes')
const marcadores = document.querySelector('#marcadores')

// Elementos do terceiro slide
const card = document.querySelector('#card-i');
const cardv = document.querySelector('#card-v');

// Configuração do botão de cálculo para que começe desativado e,
// em combinação com o css, o torne invisível.
botcalcular.disabled = true;
botlimpar.disabled = true;

// Dois trechos de código que criam os elementos que compoem a section em grid que contém 
// o gráfico. Este primeiro cria, para cada entrada no intervalo das gerações, uma div nova.
// Cada uma contém os elementos de data de início da geração e o respectivo nome. Uma das linhas
// faz o o cálculo do tamanho que a div deve ter para que fique proporcional no dispositivo. Outra
// linha coloca o nome da geração dentro da div. Para o atributo data-inicio é enviado o ano de início
// da geração. Este dado é consumido no CSS com a declaração ::before. No segundo trecho,
// para cada valor no intervalo, uma nova div. É uma segunda section que compartilha o mesmo nome de grid-area.
// É assim que elas ficam sobrepostas e por isso precisam  ter as divs de mesmo tamanho - o código até aí então
// é o mesmo. Na última linha é definido que o destino das divs é a seção de ID marcadores. 

for (let geracao of idsgeracoes) {

    let divgeracao = document.createElement('div');
    
    divgeracao.innerHTML = `<a class="nomegeracao">${geracao.nome}</a>`;
    
    divgeracao.dataset.inicio = geracao.inicio;
    let alturadiv = geracao.fim - geracao.inicio;
    divgeracao.style.setProperty('--altura', `${alturadiv}%`);

    // divgeracao.style.height = `${alturadiv}%`;
    dividgeracoes.appendChild(divgeracao);
    
    let divmarcador = document.createElement('div');
    divmarcador.style.height = `${alturadiv}%`;
    marcadores.appendChild(divmarcador);
}

  // Função de cálculo. O parâmetro é o valor do número validado pela função acima.
function calcular(anoNasc) { 

  // Define o índice de gerações como o intervalo dos valores + 1.
  let indice = idsgeracoes.length + 1;
  entrada.setAttribute("readonly", true)
  botlimpar.disabled = false;
  botcalcular.disabled = true;

  for (let geracao of idsgeracoes) {
    // Loop pelo intervalo de gerações, em que a primeira linha
    // é uma instrução para diminuir em uma unidade para cada geração iterada.
    indice--;

    if (anoNasc <= geracao.fim) {
      // Quando o valor do ano inserido for menor ou igual
      // ao ano em que termina uma geração (geracao.fim),
      // definir variáveis a serem destacadas de acordo com
      // o valor do índice correspondente à geração e ao anoNasc
      // inserido no input no início da experiência.
      let texto = geracao.texto;
      let numG = parseInt(idsgeracoes.length - indice);
      let iniG = geracao.inicio;
      let fimG = geracao.fim;
      let alturaNasc = 100 - ((fimG - anoNasc) * 100 / (fimG - iniG));
      destacarGeracao( numG, iniG, fimG, texto, anoNasc);
      posicaoMarcador( numG, anoNasc, alturaNasc, iniG, fimG ); 
      break
    };
  };
}

// Função que destaca a geração correspondente ao número do índice
// inserindo as informações calculadas de acordo com o número do ano
// informado pelo usuário no campo de input.
function destacarGeracao( numG, iniG, fimG, texto, anoNasc ) {
  
  let indice = -1
  let geracoesdivs = document.querySelectorAll('#geracoes>div');  
  for ( let divgeracao of geracoesdivs ) {
    ++indice
    if (indice == numG){
      divgeracao.classList.add('mostrar');
      cardv.innerHTML = `<div>${texto}</div>`;
      // Iniciar a função que desliza a visualização do viewport
      // para o faixa da geração correspondente ao valor inserido.
      mostraSecao(divgeracao);
      // let mostrarme1 = geracoesdivs[n-1];
      // let mostrarma1 = geracoesdivs[n+1];

      function hasClass(elem, className) {
        return elem.classList.contains(className);
      }
      
      document.addEventListener('click', function(e) {
        if (hasClass(e.target, 'mostrar')) {
          expandirGeracao(`${numG}`, `${iniG}`, `${fimG}`,`${anoNasc}`);
        }
      }, false);
    }
  }
}

// Função que movimenta o marcador com
// o ano de nascimento informado pelo usuário.
function posicaoMarcador(numG, anoNasc, alturaNasc, iniG, fimG) {

    let indice = -1;
    let divparamarcadores = document.querySelectorAll('#marcadores>div');

    divparamarcadores.forEach((linhaNasc) => {
      ++indice;
      if (indice == numG) {
        linhaNasc.classList.add('mostrar');
        linhaNasc.innerHTML = `<div id="linhaNasc" style="height:${alturaNasc}%;">${anoNasc}</div>`;
      }
    });

    console.log(`Nasceu em ${anoNasc} geração ID ${numG} início em ${iniG} e termina em ${fimG}`);
};

function expandirGeracao(numG, iniG, fimG, anoNasc ) {

  let geracoesdivs = document.querySelectorAll('#geracoes>div');
  let marcadores = document.querySelector('#marcadores');
  let excetomostrar = document.querySelectorAll('#geracoes>div:not([class="mostrar"])');

  for (let remover of excetomostrar) {
    remover.style.display = 'none';
  }

  while (marcadores.firstChild) {
    marcadores.removeChild(marcadores.firstChild);
  }

  let mostrar = geracoesdivs[numG];
  mostrar.style.height = 100 + '%';
  mostrar.style.cursor = 'auto';
  mostrar.removeAttribute('onclick');
  mostrar.classList.add('expandir');

  for (let fato of idsfatos) {
    if (fimG >= fato.quando && fato.quando >= iniG) {
      let linha = document.createElement('div');
      let posicao = (100 / fimG - iniG);
      linha.style.height = `${posicao}%`;
      linha.dataset.quando = fato.quando
      linha.innerHTML = `<span class="fato quando">${fato.quando}</span><span class="fato que">${fato.oque}</span>` 
      timeline.appendChild(linha)
      if (linha.dataset.quando == anoNasc ){
      linha.classList.add('voce');
      linha.innerHTML = `<span class="fato quando">${fato.quando}</span><span class="fato que">Seu nascimento</span>`
      }  
    }
  }

}

  // Função que reseta a calculadora para seu estado inicial.
function limpar() {

  card.classList.remove('virar');

  let geracoesdivs = document.querySelectorAll('#geracoes>div');
  let linhaNasc = document.querySelector('#marcadores>div.mostrar');
  let linhaFatos = document.querySelectorAll('#timeline>div');

  for (let divgeracao of geracoesdivs) {

    divgeracao.classList.remove('mostrar');
    divgeracao.classList.remove('expandir');

    if (linhaNasc != null) {
      linhaNasc.classList.remove('mostrar');
      linhaNasc.innerHTML = '';
      divgeracao.style.display = 'grid';
      divgeracao.removeAttribute('onclick');
      divgeracao.style.height = divgeracao.dataset.fim - divgeracao.dataset.inicio + '%';
    }
  }

for (let linha of linhaFatos) {
  if (linhaFatos != null) {
    linha.innerHTML = '';
  }
}
};

// Função validar checa: 1. entrada input tem um valor de preenchimento.
// 2. É maior ou igual do que 1882 e menor ou igual a 2026.
function validar() {

  let anoNasc = parseInt(entrada.value, 10);
  // Converte o anoNasc em um valor inteiro (número)
  
  if (isNaN(anoNasc) || anoNasc <= 1882 || anoNasc >= 2026) {
    // Checa condições descritas acima. Se verdadeira, reseta as configurações
    botcalcular.disabled = true;
    limpar();
  }
  else {
    botcalcular.disabled = false;
  }
  return anoNasc;
}

// Define a função que desliza a visualização do viewport
// para o faixa da geração correspondente ao valor inserido.
function mostraSecao( secao ) {
  secao.scrollIntoView( { behavior: "smooth" } );
}

// Define variáveis e função para observar quando o terceiro slide
// estive em foco no viewport do usuário, acionando a virada do card.
new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('virar');
      return;
    }
    entry.target.classList.remove('virar');
  });
}).observe(card);

// Configuração de escutador do elemento entrada. Ele checa o preenchimento de
// texto em um input, executando para cada novo digito inserido a validação do ano inserido.
entrada.addEventListener('input', validar);

// Abaixo, o código pergunta para o mesmo escutador de entrada se ele ouviu algum
// botão ser pressionado no teclado - desktop ou celular.
entrada.addEventListener('keypress', (event) => {
// Se for pressionada uma tecla, a função checa duas condições: primeiro se a tecla
// pressionada foi 'Enter'; e segundo, se o botão de cáculo está visiível.
// Para que esta última condição seja verdade, a função na página já confirmou
// que o input foi preenchido por um número do ano válido: é inteiro está no
// intervalo descrito nos dados.
  if (botcalcular.disabled == false && event.key === 'Enter') {
    calcular(validar());
    // Quando essas duas condições são verdadeiras, é feito então o cálculo
    // de posicionamento do marcador de nascimento.
  }
})

document.addEventListener('click', function(e) {
  if (botcalcular.disabled == false) {
    calcular(validar());
  }
}, false);

}))();