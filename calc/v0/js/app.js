(async () => {
  const resposta = await fetch('geracoes.json');
  const dados = await resposta.json();

  const entrada = document.querySelector('#ano-nascimento');
  const form = document.querySelector('#birth-form');
  const botCalcular = document.querySelector('#calcular');
  const botResultado = document.querySelector('#ver-resultado');
  const botVoltarTimeline = document.querySelector('#voltar-timeline');
  const ajuda = document.querySelector('#entrada-ajuda');
  const app = document.querySelector('#app');
  const geracoesEl = document.querySelector('#geracoes');
  const marcadoresEl = document.querySelector('#marcadores');
  const resultadoEl = document.querySelector('#resultado');
  const resultadoChamada = document.querySelector('#resultado-chamada');
  const painelTimeline = document.querySelector('#grafico');
  const painelResultado = document.querySelector('#cards');

  const geracoes = dados.ids;
  const fatos = dados.fatos;
  const inicioTimeline = Math.min(...geracoes.map((geracao) => geracao.inicio));
  const fimTimeline = Math.max(...geracoes.map((geracao) => geracao.fim));
  const totalTimeline = (fimTimeline - inicioTimeline) + 1;
  const anoAtual = new Date().getFullYear();

  let resultadoAtual = null;

  botCalcular.disabled = true;
  botResultado.disabled = true;

  function plural(valor, singular, pluralizado) {
    return valor === 1 ? singular : pluralizado;
  }

  function posicaoNaTimeline(ano) {
    return ((ano - inicioTimeline) * 100) / Math.max(1, fimTimeline - inicioTimeline);
  }

  function posicaoNaGeracao(geracao, ano) {
    return ((ano - geracao.inicio) * 100) / Math.max(1, geracao.fim - geracao.inicio);
  }

  function textoPosicaoGeracao(posicao) {
    if (posicao < 18) return 'bem no começo';
    if (posicao < 38) return 'no primeiro terço';
    if (posicao < 62) return 'perto do meio';
    if (posicao < 82) return 'no terço final';
    return 'bem no fim';
  }

  function limparTextoGeracao(texto) {
    return texto
      .replace(/<b>.*?<\/b><br><br>/s, '')
      .replaceAll('<br><br>', '</p><p>')
      .replaceAll('<br>', ' ');
  }

  function encontrarGeracao(ano) {
    return geracoes.find((geracao) => ano >= geracao.inicio && ano <= geracao.fim);
  }

  function encontrarIndiceGeracao(geracaoAlvo) {
    return geracoes.findIndex((geracao) => geracao.id === geracaoAlvo.id);
  }

  function renderGeracoes() {
    geracoesEl.innerHTML = '';

    for (const geracao of geracoes) {
      const faixa = document.createElement('article');
      const altura = (((geracao.fim - geracao.inicio) + 1) * 100) / totalTimeline;

      faixa.className = 'generation-band';
      faixa.dataset.id = geracao.id;
      faixa.style.setProperty('--altura', `${altura}%`);
      faixa.innerHTML = `
        <span class="generation-years">${geracao.inicio}–${geracao.fim}</span>
        <strong>${geracao.nome}</strong>
      `;

      geracoesEl.appendChild(faixa);
    }
  }

  function validarEntrada(mostrarErro = false) {
    const ano = Number.parseInt(entrada.value, 10);
    const valido = Number.isInteger(ano) && ano >= inicioTimeline && ano <= fimTimeline;

    botCalcular.disabled = !valido;
    entrada.setAttribute('aria-invalid', String(!valido && entrada.value.length >= 4));

    if (valido) {
      ajuda.textContent = 'Ano válido. Pressione Enter ou calcule.';
      ajuda.dataset.state = 'success';
      return ano;
    }

    ajuda.dataset.state = mostrarErro ? 'error' : 'idle';
    ajuda.textContent = mostrarErro
      ? `Use um ano entre ${inicioTimeline} e ${fimTimeline}.`
      : `Use um ano entre ${inicioTimeline} e ${fimTimeline}.`;

    return null;
  }

  function destacarTimeline(geracao, ano) {
    const posicao = posicaoNaTimeline(ano);
    const bandas = document.querySelectorAll('.generation-band');
    let selecionada = null;

    for (const banda of bandas) {
      const ativa = Number(banda.dataset.id) === geracao.id;
      banda.classList.toggle('is-selected', ativa);
      if (ativa) {
        selecionada = banda;
      }
    }

    marcadoresEl.innerHTML = `
      <div class="birth-marker" style="--posicao: ${posicao}%">
        <span>${ano}</span>
        <strong>seu nascimento</strong>
      </div>
    `;

    return selecionada;
  }

  function fatosDaGeracao(geracao) {
    return fatos
      .filter((fato) => fato.quando >= geracao.inicio && fato.quando <= geracao.fim && fato.oque.trim())
      .sort((a, b) => a.quando - b.quando);
  }

  function rolarParaPainel(painel, comportamento = 'smooth') {
    const mover = () => {
      const esquerda = painel.offsetLeft;
      app.scrollTo({ left: esquerda, behavior: comportamento });

      if (comportamento === 'auto') {
        app.scrollLeft = esquerda;
      }
    };

    if (comportamento === 'auto') {
      window.requestAnimationFrame(() => window.requestAnimationFrame(mover));
      return;
    }

    mover();
  }

  function renderResultado(geracao, ano) {
    const indice = encontrarIndiceGeracao(geracao);
    const anterior = geracoes[indice - 1];
    const proxima = geracoes[indice + 1];
    const duracao = (geracao.fim - geracao.inicio) + 1;
    const anosDesdeInicio = ano - geracao.inicio;
    const anosAteFim = geracao.fim - ano;
    const idadeAnoAtual = Math.max(0, anoAtual - ano);
    const posicao = posicaoNaGeracao(geracao, ano);
    const fatosGeracao = fatosDaGeracao(geracao);

    resultadoChamada.textContent = `O ano de ${ano} fica ${textoPosicaoGeracao(posicao)} da ${geracao.nome}.`;
    resultadoEl.innerHTML = `
      <article class="result-card result-main">
        <span class="card-label">Resultado</span>
        <h3>${geracao.nome}</h3>
        <p>Você nasceu em <b>${ano}</b>, ${textoPosicaoGeracao(posicao)} desse recorte geracional.</p>
      </article>

      <article class="result-card range-card">
        <span class="card-label">Seu lugar na geração</span>
        <div class="range-line" style="--posicao: ${posicao}%">
          <span class="range-start">${geracao.inicio}</span>
          <span class="range-birth">${ano}</span>
          <span class="range-end">${geracao.fim}</span>
        </div>
        <ul class="range-facts">
          <li>${anosDesdeInicio === 0 ? 'Ano de abertura da geração.' : `${anosDesdeInicio} ${plural(anosDesdeInicio, 'ano', 'anos')} depois do início.`}</li>
          <li>${anosAteFim === 0 ? 'Último ano do recorte.' : `${anosAteFim} ${plural(anosAteFim, 'ano', 'anos')} antes do fim.`}</li>
          <li>Em ${anoAtual}, quem nasceu nesse ano completa ${idadeAnoAtual} ${plural(idadeAnoAtual, 'ano', 'anos')}.</li>
          <li>O recorte inteiro cobre ${duracao} ${plural(duracao, 'ano', 'anos')}.</li>
        </ul>
      </article>

      <article class="result-card definition-card">
        <span class="card-label">O que define</span>
        <div class="generation-text"><p>${limparTextoGeracao(geracao.texto)}</p></div>
      </article>

      <article class="result-card neighbors-card">
        <span class="card-label">Antes / depois</span>
        <div class="neighbor-row">
          <span>Antes</span>
          <strong>${anterior ? anterior.nome : 'sem geração anterior'}</strong>
          <small>${anterior ? `${anterior.inicio}–${anterior.fim}` : ''}</small>
        </div>
        <div class="neighbor-row">
          <span>Depois</span>
          <strong>${proxima ? proxima.nome : 'recorte mais recente'}</strong>
          <small>${proxima ? `${proxima.inicio}–${proxima.fim}` : ''}</small>
        </div>
      </article>

      <article class="result-card events-card">
        <span class="card-label">Fatos do período</span>
        <div class="event-list">
          ${fatosGeracao.map((fato) => `
            <div class="event-item${fato.quando === ano ? ' is-birth-year' : ''}">
              <time>${fato.quando}</time>
              <p>${fato.quando === ano ? 'Seu nascimento. ' : ''}${fato.oque}</p>
            </div>
          `).join('')}
        </div>
      </article>

      <button id="recomecar" class="reset-card" type="button">Recomeçar</button>
    `;

    document.querySelector('#recomecar').addEventListener('click', reiniciar);
  }

  function calcular(destino = 'timeline', comportamento = 'smooth') {
    const ano = validarEntrada(true);
    if (!ano) return;

    const geracao = encontrarGeracao(ano);
    if (!geracao) return;

    resultadoAtual = { geracao, ano };
    entrada.readOnly = true;
    botCalcular.disabled = true;
    botResultado.disabled = false;

    const bandaSelecionada = destacarTimeline(geracao, ano);
    renderResultado(geracao, ano);
    const painelDestino = destino === 'resultado' ? painelResultado : painelTimeline;
    rolarParaPainel(painelDestino, comportamento);

    if (destino === 'timeline' && bandaSelecionada) {
      const rolarAteBanda = () => bandaSelecionada.scrollIntoView({ behavior: comportamento, block: 'center', inline: 'nearest' });

      if (comportamento === 'smooth') {
        window.setTimeout(rolarAteBanda, 320);
      } else {
        rolarAteBanda();
      }
    }
  }

  function reiniciar() {
    resultadoAtual = null;
    entrada.readOnly = false;
    entrada.value = '';
    botCalcular.disabled = true;
    botResultado.disabled = true;
    ajuda.dataset.state = 'idle';
    ajuda.textContent = `Use um ano entre ${inicioTimeline} e ${fimTimeline}.`;
    marcadoresEl.innerHTML = '';
    resultadoChamada.textContent = 'Calcule um ano para preencher estes cartões.';
    resultadoEl.innerHTML = `
      <article class="result-card result-card-empty">
        <h3>Esperando um ano.</h3>
        <p>O resultado aparece aqui com régua comparativa, texto da geração e fatos históricos do período.</p>
      </article>
    `;

    for (const banda of document.querySelectorAll('.generation-band')) {
      banda.classList.remove('is-selected');
    }

    entrada.focus({ preventScroll: true });
    rolarParaPainel(document.querySelector('#titulo'));
  }

  entrada.addEventListener('input', () => validarEntrada(false));
  entrada.addEventListener('blur', () => validarEntrada(entrada.value.length > 0));

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calcular();
  });

  botResultado.addEventListener('click', () => {
    if (resultadoAtual) {
      rolarParaPainel(painelResultado);
    }
  });

  botVoltarTimeline.addEventListener('click', () => {
    rolarParaPainel(painelTimeline);
  });

  renderGeracoes();

  const params = new URLSearchParams(window.location.search);
  const anoParam = params.get('ano');
  if (anoParam) {
    entrada.value = anoParam.slice(0, 4);
    if (validarEntrada(false)) {
      calcular(params.get('resultado') === '1' ? 'resultado' : 'timeline', 'auto');
    }
  }
})();
