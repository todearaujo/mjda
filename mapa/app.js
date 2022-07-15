let mapaMalha;
let mapaEstados;
let mapaDados;

async function loadMapData(){
    // endereço da malha do Brasil
    let mapaUrl = 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=image/svg+xml&qualidade=maxima&intrarregiao=UF'
    // endereço dos dados da região norte, por município, na API do IBGE
    let estadosUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?formato=application/json'
    let dadosUrl='dados/casamentos.json';
    // 'https://servicodados.ibge.gov.br/api/v1/localidades/regioes/N/municipios?formato=application/json';

    // carrega o arquivo da malha da URL do IBGE
    let mapaSvg = await fetch(mapaUrl);
    // converte os dados carregados para o formato de string
    mapaMalha = await mapaSvg.text();
    // carrega os estados a serem exibidos no mapa
    let estadosJson = await fetch(estadosUrl);
    mapaEstados = await estadosJson.json();
    // carrega os dados a serem exibidos no mapa
    let dadosJson = await fetch(dadosUrl);
    mapaDados = await dadosJson.json();
    console.log(mapaDados)

    let mapaConteudo = document.querySelector('#mapa-conteudo');
    mapaConteudo.innerHTML = mapaMalha;

    let elemEstado = document.querySelectorAll('#mapa-conteudo svg path');

    elemEstado.forEach((elemento) => {
        mapaDados.forEach((estado) => {
            if (elemento.id == estado.ide) {
                elemento.dataset.indice = estado.numero
                elemento.dataset.nome = estado.estado
            }
        });
        // determina a opacidade de cor do preenchimento de acordo com o índice
        elemento.onmouseover = marcaEstado;
        // determina a função a executar no mouseout
        elemento.onmouseout = desmarcaEstado;
    });
}

function marcaEstado(event){
    // seleciona o alvo do evento (o vetor do município)
    let elemento = event.target;


    // tira a classe 'ativo' da seleção anterior, se houver
    let selecaoAnterior = document.querySelector('path.ativo');
    if(selecaoAnterior){ selecaoAnterior.classList.remove("ativo") }

    // adiciona a classe 'ativo' ao elemento atual
    elemento.classList.add("ativo");

    // preenche os elementos com nome, UF e o índice
    document.querySelector('#estado-titulo').textContent = elemento.dataset.nome ;
    document.querySelector('#estado-valor').textContent = elemento.dataset.indice + ' casamentos';
}

function desmarcaEstado(event){
    // seleciona o alvo do evento (o vetor do município)
    let elemento = event.target;
    // remove a classe de destaque
    elemento.classList.remove("ativo");
}

loadMapData();