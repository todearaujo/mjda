let mapaMalha;
let mapaEstados;
let mapaDados;
let autoPlay = true;
let apresentar

async function mapa(){
    let mapaUrl = 'bruf.svg'
    let estadosUrl = 'estados.json'
    let porEstadoUrl='porestado.json';
    let porGeneroUrl='porgenero.json';

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
                elemento.setAttribute('fill-opacity', elemento.dataset.indice * 1.3);
                elemento.setAttribute('fill', 'white');
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
            clearInterval(apresentar);
        }

        elemento.onmouseout = (event) => {
            desmarcaEstado(event);
            autoPlay = true;
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
    document.querySelector('#uf').textContent = elemento.dataset.uf;
    document.querySelector('#pop').textContent = elemento.dataset.pop;
    document.querySelector('.ct').textContent = elemento.dataset.ct + ' casamentos';
    document.querySelector('.cpnum').textContent = elemento.dataset.cp100;
    document.querySelector('.cptxt').textContent = ' / 100 mil hab.';
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
}

const playMapa = () => {
    if (autoPlay == true) {
        apresentar = setInterval(proxEstado, 4000);
    }
}

playMapa();