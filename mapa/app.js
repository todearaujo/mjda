let mapaMalha;
let mapaEstados;
let mapaDados;

async function loadMapData(){
    let mapaUrl = 'bruf.svg';
    let estadosUrl = 'dados/estados.json';
    let dadosUrl='dados/porestado.json';

    let mapaSvg = await fetch(mapaUrl);
    mapaMalha = await mapaSvg.text();
    let estadosJson = await fetch(estadosUrl);
    mapaEstados = await estadosJson.json();
    let dadosJson = await fetch(dadosUrl);
    mapaDados = await dadosJson.json();
    console.log(mapaDados)

    let mapaConteudo = document.querySelector('#mapa-conteudo');
    mapaConteudo.innerHTML = mapaMalha;

    let elemEstado = document.querySelectorAll('#mapa-conteudo svg path');

    elemEstado.forEach((elemento) => {
        mapaDados.forEach((estado) => {
            if (elemento.id == estado.ide) {
                elemento.dataset.indice = estado.casamentos
                elemento.dataset.nome = estado.estado
            }
        });
        elemento.onmouseover = marcaEstado;
        elemento.onmouseout = desmarcaEstado;
    });
}

function marcaEstado(event){
    let elemento = event.target;

    let selecaoAnterior = document.querySelector('path.ativo');
    if(selecaoAnterior){ selecaoAnterior.classList.remove("ativo") }

    elemento.classList.add("ativo");

    document.querySelector('#estado-titulo').textContent = elemento.dataset.nome ;
    document.querySelector('#estado-valor').textContent = elemento.dataset.indice + ' casamentos';
}

function desmarcaEstado(event){
    let elemento = event.target;
    elemento.classList.remove("ativo");
}

loadMapData();