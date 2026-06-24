const formatter = new Intl.NumberFormat("pt-BR");
const rateFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
const millionFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

// Números ajustáveis num lugar só (enquadramento da câmera).
const CONFIG = {
  robustTrim: 0.04,        // corta 4% das pontas do contorno (ignora ilhas oceânicas)
  padSmallThreshold: 0.06, // abaixo disso o estado é "pequeno"
  padSmall: 1.6,           // folga em volta de estados pequenos
  padBig: 1.5,             // folga em volta dos demais
  minZoom: 0.40,           // piso de zoom (fração da altura do mapa) p/ estados minúsculos
  stateBiasY: 0.38,        // viés vertical do estado (sobe p/ não ficar atrás do card)
  countryMargin: 1.08,     // folga ao redor do país no enquadramento nacional
  countryBiasY: 0.34       // viés vertical do país
};

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

// --- Câmera por estado (transform CSS, disparada por IntersectionObserver) ---
let cameras = [];
let stepEls = [];
let activeIdx = -1;
let observer = null;
const frameMQ = window.matchMedia("(min-width: 700px) and (min-height: 620px)");

// Converte um viewBox-alvo T (espaço do viewBox do SVG) num transform CSS sobre o
// <svg> que mostra a região T preenchendo a moldura — sem tocar no atributo viewBox
// (que segue no extent completo V, com preserveAspectRatio slice). Reusa toda a
// matemática de enquadramento (targetViewBoxFor/countryViewBox).
const cameraTransformFor = (T) => {
  if (!T || !fullViewBox || !mapSvg) return { scale: 1, ox: 0, oy: 0, tx: 0, ty: 0 };
  const W = mapSvg.clientWidth;
  const H = mapSvg.clientHeight;
  const V = fullViewBox;
  const s0 = Math.max(W / V.width, H / V.height); // escala base (slice = cover)
  const sT = Math.max(W / T.width, H / T.height); // escala se o viewBox fosse T
  const Vcx = V.x + V.width / 2;
  const Vcy = V.y + V.height / 2;
  const Tcx = T.x + T.width / 2;
  const Tcy = T.y + T.height / 2;
  // Pixel (no elemento) onde o centro de T cai na projeção base.
  const cx = W / 2 + (Tcx - Vcx) * s0;
  const cy = H / 2 + (Tcy - Vcy) * s0;
  // Pivô = esse pixel (invariante sob escala); translada o pivô p/ o centro da moldura.
  return { scale: sT / s0, ox: cx, oy: cy, tx: W / 2 - cx, ty: H / 2 - cy };
};

// Escreve a câmera nas custom properties; a animação em si é pura transição CSS.
const applyCamera = (T, animate) => {
  if (!mapSvg) return;
  const c = cameraTransformFor(T);
  const s = mapSvg.style;
  s.setProperty("--cam-dur", animate && !reducedMotion ? "" : "0ms");
  s.setProperty("--cam-scale", String(c.scale));
  s.setProperty("--cam-ox", `${c.ox}px`);
  s.setProperty("--cam-oy", `${c.oy}px`);
  s.setProperty("--cam-tx", `${c.tx}px`);
  s.setProperty("--cam-ty", `${c.ty}px`);
};

// Ativa um painel: viaja a câmera (CSS), atualiza o card, a barra e a borda do estado.
const setActive = (index, animate = true) => {
  if (index < 0 || index >= cameras.length || index === activeIdx) return;
  activeIdx = index;
  applyCamera(cameras[index], animate);
  const step = stepEls[index];
  if (step) updatePanels(step.dataset.id);
  if (els.progressFill && stepEls.length > 1) {
    els.progressFill.style.width = `${(index / (stepEls.length - 1)) * 100}%`;
  }
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

// Detecta o painel ativo (o .step mais visível) e dispara setActive. Sem handler
// por frame de scroll: o snap define as paradas e a transição CSS faz a viagem.
// Como cada .step é uma viewport inteira com snap-align start, no repouso só um
// passa de 0.5 de visibilidade.
const setupObserver = () => {
  if (observer) observer.disconnect();
  const root = frameMQ.matches ? document.querySelector(".experience-frame") : null;
  observer = new IntersectionObserver(
    (entries) => {
      let best = null;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      });
      if (best) {
        const idx = stepEls.indexOf(best.target);
        if (idx >= 0) setActive(idx, true);
      }
    },
    { root, threshold: 0.5 }
  );
  stepEls.forEach((step) => observer.observe(step));
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

const init = async () => {
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
    setActive(0, false); // Brasil (intro): identidade, sem animação no 1º paint
    setupObserver();
  });

  let resizeTimer;
  let wasFrame = frameMQ.matches;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      computeCameras();
      if (activeIdx >= 0) applyCamera(cameras[activeIdx], false);
      if (frameMQ.matches !== wasFrame) {
        wasFrame = frameMQ.matches; // o root do observer muda entre mobile/desktop
        setupObserver();
      }
    }, 150);
  });
};

init().catch((error) => {
  els.rank.textContent = "Não foi possível carregar os dados";
  console.error(error);
});
