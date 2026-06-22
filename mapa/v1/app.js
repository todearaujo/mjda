const formatter = new Intl.NumberFormat("pt-BR");
const rateFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
const millionFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

// População aproximada e arredondada para o mais próximo, ex.: "~4,3 milhões".
const approxPop = (n) => {
  if (n >= 1e6) {
    const m = n / 1e6;
    const r = m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
    return `~${millionFormatter.format(r)} ${r === 1 ? "milhão" : "milhões"} de pessoas`;
  }
  return `~${formatter.format(Math.round(n / 1000))} mil pessoas`;
};

const stateById = new Map();
let orderedStates = [];
let mapSvg = null;
let fullViewBox = null;
let currentViewBox = null;
let zoomAnimation = null;

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
  note: document.querySelector("#state-note")
};

const lavenderFor = (indice) => {
  const light = 90 - Math.round(indice * 38);
  const saturation = 42 + Math.round(indice * 18);
  return `hsl(266 ${saturation}% ${light}%)`;
};

const positionLabelFor = (index) => `${orderedStates.length - index}º de ${orderedStates.length}`;

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const parseViewBox = (svg) => {
  const box = svg.viewBox.baseVal;
  return { x: box.x, y: box.y, width: box.width, height: box.height };
};

const viewBoxString = ({ x, y, width, height }) => `${x} ${y} ${width} ${height}`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const bboxInSvgSpace = (path) => {
  if (!mapSvg) return null;

  const box = path.getBBox();
  const svgMatrix = mapSvg.getScreenCTM();
  const pathMatrix = path.getScreenCTM();
  if (!svgMatrix || !pathMatrix) return null;

  const matrix = svgMatrix.inverse().multiply(pathMatrix);
  const points = [
    new DOMPoint(box.x, box.y),
    new DOMPoint(box.x + box.width, box.y),
    new DOMPoint(box.x + box.width, box.y + box.height),
    new DOMPoint(box.x, box.y + box.height)
  ].map((point) => point.matrixTransform(matrix));

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return {
    x,
    y,
    width: Math.max(...xs) - x,
    height: Math.max(...ys) - y
  };
};

const targetViewBoxFor = (path) => {
  if (!fullViewBox || !mapSvg) return null;

  const box = bboxInSvgSpace(path);
  if (!box) return null;

  // Aspecto da área visível (a "tela" da moldura). O viewBox é forçado a casar
  // com ele, então o estado preenche as bordas sem letterbox.
  const aspect = mapSvg.clientWidth && mapSvg.clientHeight
    ? mapSvg.clientWidth / mapSvg.clientHeight
    : fullViewBox.width / fullViewBox.height;

  // Folga em volta do estado: apertada nos grandes, um respiro a mais nos pequenos.
  const stateShare = Math.max(box.width, box.height) / Math.max(fullViewBox.width, fullViewBox.height);
  const pad = stateShare < 0.06 ? 1.7 : stateShare < 0.12 ? 1.35 : 1.15;

  let width = box.width * pad;
  let height = box.height * pad;

  // Cresce o lado menor para casar o aspecto da moldura (preenche, não corta o estado).
  if (width / height > aspect) {
    height = width / aspect;
  } else {
    width = height * aspect;
  }

  // Piso de zoom: evita aproximar demais estados minúsculos (DF, SE, AL, RJ).
  const minHeight = fullViewBox.height * 0.34;
  if (height < minHeight) {
    height = minHeight;
    width = height * aspect;
  }

  // Teto: nunca passa do mapa inteiro, preservando o aspecto ao bater no limite.
  if (width > fullViewBox.width) {
    width = fullViewBox.width;
    height = width / aspect;
  }
  if (height > fullViewBox.height) {
    height = fullViewBox.height;
    width = height * aspect;
  }

  // Enviesa o enquadramento para cima: o card cobre a base da moldura, então o
  // estado fica a ~36% da altura, na área livre acima dele. O piso em fullViewBox.y
  // evita vazio acima do mapa; abaixo pode sobrar fundo (fica atrás do card).
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  return {
    x: clamp(centerX - width / 2, fullViewBox.x, fullViewBox.x + fullViewBox.width - width),
    y: Math.max(centerY - height * 0.36, fullViewBox.y),
    width,
    height
  };
};

const animateViewBox = (target) => {
  if (!mapSvg || !target) return;

  cancelAnimationFrame(zoomAnimation);
  if (reducedMotion || !currentViewBox) {
    currentViewBox = target;
    mapSvg.setAttribute("viewBox", viewBoxString(target));
    return;
  }

  const start = currentViewBox;
  const duration = 560;
  const startedAt = performance.now();
  const ease = (value) => 1 - Math.pow(1 - value, 3);

  const step = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = ease(progress);
    currentViewBox = {
      x: start.x + (target.x - start.x) * eased,
      y: start.y + (target.y - start.y) * eased,
      width: start.width + (target.width - start.width) * eased,
      height: start.height + (target.height - start.height) * eased
    };
    mapSvg.setAttribute("viewBox", viewBoxString(currentViewBox));

    if (progress < 1) {
      zoomAnimation = requestAnimationFrame(step);
    }
  };

  zoomAnimation = requestAnimationFrame(step);
};

const selectState = (id) => {
  const state = stateById.get(String(id));
  if (!state) return;

  document.querySelectorAll(".map path").forEach((path) => {
    path.classList.toggle("active", path.id === String(id));
    path.classList.toggle("dimmed", path.id !== String(id));
  });

  const path = document.getElementById(String(id));
  path?.parentElement.appendChild(path);
  if (path) animateViewBox(targetViewBoxFor(path));

  const index = orderedStates.findIndex((item) => item.ide === state.ide);
  els.rank.textContent = `${positionLabelFor(index)} · ${state.regiao}`;
  els.name.textContent = state.estado;
  els.flag.hidden = false;
  els.flag.src = `flags/${state.uf}.svg`;
  els.flag.alt = `Bandeira de ${state.estado}`;
  els.rate.textContent = rateFormatter.format(state.cp100);
  els.total.textContent = formatter.format(state.casamentos);
  els.men.textContent = formatter.format(state.homem);
  els.women.textContent = formatter.format(state.mulher);
  els.note.textContent = `População estimada em 2024: ${approxPop(state.pop)}.`;

  document.querySelectorAll(".step").forEach((step) => {
    step.classList.toggle("active", step.dataset.id === String(id));
  });
};

const buildSteps = () => {
  els.steps.innerHTML = orderedStates
    .map((state, index) => `
      <article class="step" data-id="${state.ide}">
        <p class="rank">${positionLabelFor(index)} · ${rateFormatter.format(state.cp100)} por 100 mil hab.</p>
        <h3>${state.estado}</h3>
      </article>
    `)
    .join("");

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) selectState(visible.target.dataset.id);
  }, {
    threshold: [0.42, 0.6, 0.78],
    rootMargin: "-18% 0px -22% 0px"
  });

  document.querySelectorAll(".step").forEach((step) => observer.observe(step));
};

els.flag.addEventListener("error", () => {
  els.flag.hidden = true;
});

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
  requestAnimationFrame(() => selectState(orderedStates[0].ide));
};

init().catch((error) => {
  els.rank.textContent = "Não foi possível carregar os dados";
  console.error(error);
});
