let mapaMalha;
let mapaEstados;
let mapaDados;

async function mapa(){
    let mapaUrl = 'https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=image/svg+xml&qualidade=maxima&intrarregiao=UF'
    let estadosUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?formato=application/json'
    let dadosUrl='../dados/casamentosporestado.json';

    let mapaSvg = await fetch(mapaUrl);
    mapaMalha = await mapaSvg.text();
    let estadosJson = await fetch(estadosUrl);
    mapaEstados = await estadosJson.json();
    let dadosJson = await fetch(dadosUrl);
    mapaDados = await dadosJson.json();

    let mapaConteudo = document.querySelector('#mapa');
    mapaConteudo.innerHTML = mapaMalha;

    let elemEstado = document.querySelectorAll('#mapa svg path');

    elemEstado.forEach((elemento) => {
        mapaDados.forEach((estado) => {
            if (elemento.id == estado.ide) {
                elemento.dataset.nome = estado.estado;
                elemento.dataset.uf = estado.uf;
                elemento.dataset.pop = estado.pop.toLocaleString('pt-BR');
                elemento.dataset.ct = estado.casamentos.toLocaleString('pt-BR');
                elemento.dataset.cp100 = estado.cp100;
                elemento.dataset.indice = estado.indice;
                elemento.setAttribute('fill-opacity', elemento.dataset.indice);
                
                indice = elemento.dataset.indice
                if ( estado.indice > 0.8)  {
                        elemento.setAttribute('fill', 'white');
                }
                else if ( estado.indice > 0.6)  {                                            
                        elemento.setAttribute('fill', 'white');
                }
                else if ( estado.indice > 0.4)  {
                        elemento.setAttribute('fill', 'white');
                }
                else if ( estado.indice > 0.2)  {
                        elemento.setAttribute('fill', 'white');                                               
                }
                else if ( estado.indice > 0)  {
                    elemento.setAttribute('fill', 'white');                                                
                }
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
    elemento.parentElement.appendChild(elemento);

    document.querySelector(' #dados > .estado').textContent = elemento.dataset.nome + ' (' + elemento.dataset.uf + ')';
    document.querySelector(' #dados > .pop').textContent = 'População de ' + elemento.dataset.pop + ' hab.';
    document.querySelector(' #dados > .ct').textContent = elemento.dataset.ct + ' casamentos';
    document.querySelector(' #dados > .cp100').textContent = 'Aprox. ' + elemento.dataset.cp100 + ' / 100 mil hab.';
    document.querySelector(' #dados > .indice').textContent = elemento.dataset.indice + ' no índice de visibilidade';
}

function desmarcaEstado(event){
    let elemento = event.target;
    elemento.classList.remove("ativo");
}

mapa();