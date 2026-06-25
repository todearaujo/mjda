const formatter = new Intl.NumberFormat("pt-BR");
const rateFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
const millionFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

// Números ajustáveis num lugar só (enquadramento, câmera, permanência).
const CONFIG = {
  robustTrim: 0.04,        // corta 4% das pontas do contorno (ignora ilhas oceânicas)
  focusFraction: 0.42,     // linha de foco = 42% da altura do palco (qual estado está ativo)
  padSmallThreshold: 0.06, // abaixo disso o estado é "pequeno"
  padSmall: 1.6,           // folga em volta de estados pequenos
  padBig: 1.5,             // folga em volta dos demais
  minZoom: 0.40,           // piso de zoom (fração da altura do mapa) p/ estados minúsculos
  stateBiasY: 0.38,        // viés vertical do estado (sobe p/ não ficar atrás do card)
  countryMargin: 1.08,     // folga ao redor do país no enquadramento nacional
  countryBiasY: 0.34,      // viés vertical do país
  bulgeFactor: 0.7,        // intensidade do estufamento (zoom-out) por distância
  bulgeMax: 1.7,           // teto do estufamento
  hold: 0.34               // fração de permanência em cada ponta do trecho (tempo de leitura)
};

// Experimento: ?snap (proximity) ou ?snap=mandatory ligam o scroll-snap (ver CSS).
// No modo snap, a linha de foco vai ao centro (0.5) p/ casar com o snap-align center.
const snapMode = new URLSearchParams(location.search).has("snap");

// População aproximada por extenso, ex.: "4,3 milhões", "1 milhão" ou "636 mil".
const approxPop = (n) => {
  if (n >= 1e6) {
    const m = n / 1e6;
    const r = m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
    return `${millionFormatter.format(r)} ${r === 1 ? "milhão" : "milhões"}`;
  }
  return `${formatter.format(Math.round(n / 1000))} mil`;
};

// Taxa de nupcialidade por 1 milhão de habitantes (casamentos acumulados / pop * 1e6).
const perMillion = (s) => (s.casamentos / s.pop) * 1e6;

const stateById = new Map();
let orderedStates = [];
let mapSvg = null;
let fullViewBox = null;
let mainlandBox = null;
let currentViewBox = null;

const els = {
  map: document.querySelector("#mapa"),
  steps: document.querySelector("#steps"),
  rank: document.querySelector("#rank-label"),
  name: document.querySelector("#state-name"),
  flag: document.querySelector("#state-flag"),
  rate: document.querySelector("#state-rate"),
  total: document.querySelector("#state-total"),
  men: document.querySelector("#state-men"),
  women: document.querySelector("#state-women"),
  note: document.querySelector("#state-note"),
  progressFill: document.querySelector(".progress-fill")
};

const lavenderFor = (indice) => {
  const light = 90 - Math.round(indice * 38);
  const saturation = 42 + Math.round(indice * 18);
  return `hsl(266 ${saturation}% ${light}%)`;
};

const positionLabelFor = (index) => `${orderedStates.length - index}º de ${orderedStates.length}`;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Geometria de viewBox ---------------------------------------------------

const parseViewBox = (svg) => {
  const box = svg.viewBox.baseVal;
  return { x: box.x, y: box.y, width: box.width, height: box.height };
};

const viewBoxString = ({ x, y, width, height }) => `${x} ${y} ${width} ${height}`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const lerp = (a, b, t) => a + (b - a) * t;

// Aspecto da área visível (a "tela" da moldura).
const frameAspect = () =>
  mapSvg && mapSvg.clientWidth && mapSvg.clientHeight
    ? mapSvg.clientWidth / mapSvg.clientHeight
    : (fullViewBox ? fullViewBox.width / fullViewBox.height : 1);

// Matriz que leva o espaço do path para o espaço do viewBox do SVG.
const pathToSvgMatrix = (path) => {
  const svgMatrix = mapSvg?.getScreenCTM();
  const pathMatrix = path?.getScreenCTM();
  if (!svgMatrix || !pathMatrix) return null;
  return svgMatrix.inverse().multiply(pathMatrix);
};

// Expande (width, height) para casar o aspecto da moldura, crescendo o lado menor.
const fitToAspect = (width, height, aspect) =>
  width / height > aspect
    ? { width, height: width / aspect }
    : { width: height * aspect, height };

const bboxInSvgSpace = (path) => {
  const matrix = pathToSvgMatrix(path);
  if (!matrix) return null;

  const box = path.getBBox();
  const pts = [
    [box.x, box.y],
    [box.x + box.width, box.y],
    [box.x + box.width, box.y + box.height],
    [box.x, box.y + box.height]
  ].map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));

  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
};

// Extensão "robusta" do estado: amostra o contorno e corta os extremos
// (CONFIG.robustTrim), ignorando ilhas oceânicas distantes (Trindade no ES,
// Fernando de Noronha no PE) que inflam o bbox e jogam o centro no oceano.
const robustExtentInSvgSpace = (path) => {
  const total = path.getTotalLength?.();
  const matrix = total ? pathToSvgMatrix(path) : null;
  if (!matrix) return bboxInSvgSpace(path);

  const samples = 200;
  const xs = [];
  const ys = [];
  for (let i = 0; i <= samples; i += 1) {
    const point = path.getPointAtLength((total * i) / samples).matrixTransform(matrix);
    xs.push(point.x);
    ys.push(point.y);
  }
  xs.sort((a, b) => a - b);
  ys.sort((a, b) => a - b);

  const at = (arr, t) => arr[clamp(Math.round(t * (arr.length - 1)), 0, arr.length - 1)];
  const x0 = at(xs, CONFIG.robustTrim);
  const x1 = at(xs, 1 - CONFIG.robustTrim);
  const y0 = at(ys, CONFIG.robustTrim);
  const y1 = at(ys, 1 - CONFIG.robustTrim);
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
};

// Enquadra uma caixa na moldura: casa o aspecto e centraliza com viés vertical.
const frameToBox = (box, width, height, biasY) => ({
  x: box.x + box.width / 2 - width / 2,
  y: box.y + box.height / 2 - height * biasY,
  width,
  height
});

// --- Enquadramentos-alvo ----------------------------------------------------

const targetViewBoxFor = (path) => {
  if (!fullViewBox || !mapSvg) return null;

  const box = robustExtentInSvgSpace(path);
  if (!box) return null;

  const aspect = frameAspect();
  const stateShare = Math.max(box.width, box.height) / Math.max(fullViewBox.width, fullViewBox.height);
  const pad = stateShare < CONFIG.padSmallThreshold ? CONFIG.padSmall : CONFIG.padBig;

  let { width, height } = fitToAspect(box.width * pad, box.height * pad, aspect);

  // Piso de zoom: evita aproximar demais estados minúsculos (DF, SE, AL, RJ).
  const minHeight = fullViewBox.height * CONFIG.minZoom;
  if (height < minHeight) {
    height = minHeight;
    width = height * aspect;
  }
  // Sem teto: como o fundo é lavanda, a moldura pode passar dos limites do Brasil
  // (mostra lavanda), deixando estados grandes menores e centralizados.
  return frameToBox(box, width, height, CONFIG.stateBiasY);
};

// Caixa do continente: união das extensões robustas dos estados (ignora as ilhas
// atlânticas, que esticam o viewBox do SVG e descentralizam o país).
const computeMainlandBox = () => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  document.querySelectorAll(".map path").forEach((path) => {
    if (!stateById.has(path.id)) return;
    const e = robustExtentInSvgSpace(path);
    if (!e) return;
    x0 = Math.min(x0, e.x);
    y0 = Math.min(y0, e.y);
    x1 = Math.max(x1, e.x + e.width);
    y1 = Math.max(y1, e.y + e.height);
  });
  return x0 === Infinity ? fullViewBox : { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
};

// Enquadramento do país inteiro (centralizado no continente, com folga e viés).
const countryViewBox = () => {
  const base = mainlandBox || fullViewBox;
  if (!base || !mapSvg) return fullViewBox;
  const { width, height } = fitToAspect(
    base.width * CONFIG.countryMargin,
    base.height * CONFIG.countryMargin,
    frameAspect()
  );
  return frameToBox(base, width, height, CONFIG.countryBiasY);
};

// --- Câmera dirigida pelo scroll --------------------------------------------
let cameras = [];
let stepEls = [];
let activeId = null;
let scrollScheduled = false;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const resetScrollPosition = () => {
  window.scrollTo(0, 0);
  const frame = document.querySelector(".experience-frame");
  if (frame) frame.scrollTop = 0;
};

// Interpola dois enquadramentos com "estufamento" (zoom-out) no meio da viagem,
// proporcional à distância percorrida: perto = pan suave; longe = sobrevoo que
// abre o mapa antes de pousar no próximo estado.
const travelViewBox = (a, b, t, bulgeScale = 1) => {
  const cxA = a.x + a.width / 2;
  const cyA = a.y + a.height / 2;
  const cxB = b.x + b.width / 2;
  const cyB = b.y + b.height / 2;
  const cx = lerp(cxA, cxB, t);
  const cy = lerp(cyA, cyB, t);
  let width = lerp(a.width, b.width, t);
  let height = lerp(a.height, b.height, t);

  const dist = Math.hypot(cxB - cxA, cyB - cyA);
  const reference = Math.max(a.width, b.width, 1);
  const amplitude = Math.min((dist / reference) * CONFIG.bulgeFactor, CONFIG.bulgeMax) * bulgeScale;
  const bulge = 1 + amplitude * Math.sin(Math.PI * t);
  width *= bulge;
  height *= bulge;

  return { x: cx - width / 2, y: cy - height / 2, width, height };
};

// Remapeia a fração do trecho para criar "paradas": a câmera segura no estado nas
// pontas (tempo de ler o card) e só viaja no miolo. Ponta de um trecho e início do
// seguinte caem no mesmo enquadramento, então cada estado ganha uma permanência.
const travelEase = (t) => {
  const u = clamp((t - CONFIG.hold) / (1 - 2 * CONFIG.hold), 0, 1);
  return u * u * (3 - 2 * u);
};

// Posição contínua (0..N-1) a partir do scroll: o step cujo centro está na linha
// de foco (centro do mapa) é o ativo; entre dois, fica fracionário.
const focusIndex = () => {
  const n = stepEls.length;
  if (!n || !mapSvg) return 0;
  const stage = mapSvg.closest(".sticky-stage") || mapSvg;
  const stageRect = stage.getBoundingClientRect();
  const focusY = stageRect.top + stageRect.height * (snapMode ? 0.5 : CONFIG.focusFraction);
  const centers = stepEls.map((step) => {
    const rect = step.getBoundingClientRect();
    return rect.top + rect.height / 2;
  });
  if (focusY <= centers[0]) return 0;
  if (focusY >= centers[n - 1]) return n - 1;
  for (let i = 0; i < n - 1; i += 1) {
    if (focusY >= centers[i] && focusY <= centers[i + 1]) {
      const span = centers[i + 1] - centers[i] || 1;
      return i + (focusY - centers[i]) / span;
    }
  }
  return n - 1;
};

// Enquadramento-alvo de cada step (estados + Brasil). Refeito no resize porque
// depende do aspecto da moldura.
const computeCameras = () => {
  stepEls = Array.from(document.querySelectorAll(".step"));
  mainlandBox = computeMainlandBox();
  cameras = stepEls.map((step) => {
    const id = step.dataset.id;
    if (id === "brasil") return countryViewBox();
    const path = document.getElementById(String(id));
    return (path && targetViewBoxFor(path)) || fullViewBox;
  });
};

const nationalTotals = () =>
  orderedStates.reduce(
    (acc, s) => {
      acc.casamentos += s.casamentos;
      acc.homem += s.homem;
      acc.mulher += s.mulher;
      acc.pop += s.pop;
      return acc;
    },
    { casamentos: 0, homem: 0, mulher: 0, pop: 0 }
  );

const roundedRate = (cas, pop) => `~${formatter.format(Math.round((cas / pop) * 1e6))}`;

// Atualiza só o card e a borda do estado em foco — a câmera é dirigida pelo scroll.
const updatePanels = (id) => {
  document.querySelectorAll(".map path").forEach((path) => {
    path.classList.toggle("active", path.id === String(id));
  });
  stepEls.forEach((step) => step.classList.toggle("active", step.dataset.id === String(id)));

  if (String(id) === "brasil") {
    const totals = nationalTotals();
    els.rank.textContent = "Panorama nacional · 2013–2024";
    els.name.textContent = "Brasil";
    els.flag.hidden = true;
    els.rate.textContent = roundedRate(totals.casamentos, totals.pop);
    els.total.textContent = formatter.format(totals.casamentos);
    els.men.textContent = formatter.format(totals.homem);
    els.women.textContent = formatter.format(totals.mulher);
    els.note.textContent = `Aprox. ${approxPop(totals.pop)} era a população do país segundo o IBGE em 2024.`;
    return;
  }

  const state = stateById.get(String(id));
  if (!state) return;
  const path = document.getElementById(String(id));
  path?.parentElement.appendChild(path);

  const index = orderedStates.findIndex((item) => item.ide === state.ide);
  els.rank.textContent = `${positionLabelFor(index)} · ${state.regiao}`;
  els.name.textContent = state.estado;
  els.flag.hidden = false;
  els.flag.src = `flags/${state.uf}.svg`;
  els.flag.alt = `Bandeira de ${state.estado}`;
  els.rate.textContent = roundedRate(state.casamentos, state.pop);
  els.total.textContent = formatter.format(state.casamentos);
  els.men.textContent = formatter.format(state.homem);
  els.women.textContent = formatter.format(state.mulher);
  els.note.textContent = `Aprox. ${approxPop(state.pop)} era a população segundo o IBGE em 2024.`;
};

const renderScroll = () => {
  scrollScheduled = false;
  if (!mapSvg || !cameras.length) return;

  const index = focusIndex();
  const i0 = Math.floor(index);
  const i1 = Math.min(i0 + 1, cameras.length - 1);
  const eased = travelEase(index - i0);

  const a = cameras[i0];
  const b = cameras[i1];
  if (a && b) {
    const camera = travelViewBox(a, b, eased, reducedMotion ? 0 : 1);
    mapSvg.setAttribute("viewBox", viewBoxString(camera));
    currentViewBox = camera;
  }

  const n = stepEls.length;
  if (els.progressFill && n > 1) {
    els.progressFill.style.width = `${Math.min((i0 + eased) / (n - 1), 1) * 100}%`;
  }

  const nearest = stepEls[Math.round(index)];
  if (nearest && nearest.dataset.id !== activeId) {
    activeId = nearest.dataset.id;
    updatePanels(activeId);
  }
};

const onScroll = () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  requestAnimationFrame(renderScroll);
};

const brasilStep = `
      <article class="step" data-id="brasil">
        <p class="rank">Panorama nacional</p>
        <h3>Brasil</h3>
      </article>
    `;

const buildSteps = () => {
  els.steps.innerHTML = brasilStep + orderedStates
    .map((state, index) => `
      <article class="step" data-id="${state.ide}">
        <p class="rank">${positionLabelFor(index)} · ${rateFormatter.format(perMillion(state))} por 1 mi hab.</p>
        <h3>${state.estado}</h3>
      </article>
    `)
    .join("") + brasilStep;
};

const wireMap = () => {
  mapSvg = document.querySelector(".map svg");
  mapSvg?.removeAttribute("width");
  mapSvg?.removeAttribute("height");
  mapSvg?.setAttribute("preserveAspectRatio", "xMidYMid slice");
  if (mapSvg) {
    fullViewBox = parseViewBox(mapSvg);
    currentViewBox = fullViewBox;
  }

  document.querySelectorAll(".map path").forEach((path) => {
    const state = stateById.get(path.id);
    if (!state) return;
    path.setAttribute("fill", lavenderFor(state.indice));
    path.setAttribute("fill-opacity", "0.96");
  });
};

els.flag.addEventListener("error", () => {
  els.flag.hidden = true;
});

document.querySelector(".to-top")?.addEventListener("click", () => {
  document.querySelector(".experience-frame")?.scrollTo({ top: 0, behavior: "smooth" });
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const enableSnapExperiment = () => {
  if (!snapMode) return;
  document.documentElement.classList.add("snap");
  if (new URLSearchParams(location.search).get("snap") === "mandatory") {
    document.documentElement.classList.add("snap-mandatory");
  }
};

const init = async () => {
  enableSnapExperiment();
  resetScrollPosition();

  const [svgResponse, dataResponse] = await Promise.all([
    fetch("../shared/bruf.svg"),
    fetch("../shared/casou-onde.json")
  ]);
  const [svg, data] = await Promise.all([svgResponse.text(), dataResponse.json()]);

  els.map.innerHTML = svg;
  orderedStates = data.estados;
  orderedStates.forEach((state) => stateById.set(String(state.ide), state));

  wireMap();
  buildSteps();
  requestAnimationFrame(() => {
    computeCameras();
    renderScroll();
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  document.querySelector(".experience-frame")?.addEventListener("scroll", onScroll, { passive: true });
  let resizeTimer;
  window.addEventListener("resize", () => {
    onScroll();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      computeCameras();
      onScroll();
    }, 150);
  });
};

init().catch((error) => {
  resetScrollPosition();
  const isLocalFile = location.protocol === "file:";
  els.rank.textContent = isLocalFile ? "Dados bloqueados no arquivo local" : "Não foi possível carregar os dados";
  els.name.textContent = isLocalFile ? "Abra via servidor" : "";
  els.note.textContent = isLocalFile
    ? "O navegador bloqueia os arquivos de dados quando esta página é aberta por file://. Use o GitHub Pages ou um servidor local."
    : "Recarregue a página ou tente novamente em alguns instantes.";
  console.error(error);
});
