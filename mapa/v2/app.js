let mapaMalha;
let mapaEstados;
let mapaDados;
let autoPlay = true;
let apresentar

async function mapa(){
    let mapaUrl = 'bruf.svg'
    let estadosUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?formato=application/json'
    let porEstadoUrl='../dados/porestado.json';
    let porGeneroUrl='../dados/porgenero.json';

    let mapaSvg = await fetch(mapaUrl);
    mapaMalha = await mapaSvg.text();
    let estadosJson = await fetch(estadosUrl);
    mapaEstados = await estadosJson.json();
    let jsonEstados = await fetch(porEstadoUrl);
    estadosDados = await jsonEstados.json();
    let jsonGeneros = await fetch(porGeneroUrl);
    generoDados = await jsonGeneros.json();

    let mapaConteudo = document.querySelector('#mapa');
    mapaConteudo.innerHTML = mapaMalha;

    let elemEstado = document.querySelectorAll('#mapa svg path');
    
    elemEstado.forEach((elemento) => {
        estadosDados.forEach((estado) => {
            if (elemento.id == estado.ide) {
                elemento.dataset.nome = estado.estado;
                elemento.dataset.uf = estado.uf;
                elemento.dataset.pop = estado.pop.toLocaleString('pt-BR');
                elemento.dataset.ct = estado.casamentos.toLocaleString('pt-BR');
                elemento.dataset.cp100 = estado.cp100;
                elemento.dataset.indice = estado.indice;
                elemento.setAttribute('fill-opacity', elemento.dataset.indice * 1.2);
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

        generoDados.forEach((estado) => {
            if (elemento.id == estado.ide && estado.genero == 'Mulher') {
                elemento.dataset.mulher = estado.casamentos.toLocaleString('pt-BR');}
            else if (elemento.id == estado.ide && estado.genero == 'Homem') {
                elemento.dataset.homem = estado.casamentos.toLocaleString('pt-BR');
            }
        });
        
        elemento.onmouseover = (event) => {
            marcaEstado(event);
            autoPlay = false;
            console.log('Parar')
            clearInterval(apresentar);
            console.log('AutoPlay Desligado')
        }

        elemento.onmouseout = (event) => {
            desmarcaEstado(event);
            autoPlay = true;
            console.log('Continuar')
            playMapa();
        }

    });

}

const marcaEstado = (event) => {
  
    let elemento = event.target;

    let selecaoAnterior = document.querySelector('path.ativo');
    if(selecaoAnterior){ selecaoAnterior.classList.remove("ativo") }

    elemento.classList.add("ativo");
    elemento.parentElement.appendChild(elemento);

    document.querySelector('.estado').textContent = elemento.dataset.nome;
    document.querySelector('.uf').textContent = elemento.dataset.uf;
    document.querySelector('.pop').textContent = 'População ' + elemento.dataset.pop;
    document.querySelector('.ct').textContent = elemento.dataset.ct + ' casamentos';
    document.querySelector('.cptxt').textContent = 'Aprox.';
    document.querySelector('.cpnum').textContent = elemento.dataset.cp100 + ' / 100 mil hab.';
    document.querySelector('.inum').textContent = elemento.dataset.indice;
    document.querySelector('.homem').textContent = '👬' + elemento.dataset.homem + ' gays';
    document.querySelector('.mulher').textContent = '👭' + elemento.dataset.mulher + ' lésbicos';
}

const desmarcaEstado = (event) => {
    let elemento = event.target;
    elemento.classList.remove("ativo");
}

mapa();

const proxEstado = () => {
    let estado = document.querySelector('#mapa svg path');
    // let numero = Math.floor(Math.random() * estado.length);
    marcaEstado({ target: estado });
    console.log('Marcou estado')
}

const playMapa = () => {
    if (autoPlay == true) {
        apresentar = setInterval(proxEstado, 4000);
        console.log('AutoPlay Ligado')
    }
}

playMapa();