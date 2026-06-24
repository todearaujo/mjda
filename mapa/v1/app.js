const formatter = new Intl.NumberFormat("pt-BR");
const rateFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
const millionFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

// População aproximada e abreviada, ex.: "~4,3 mi" ou "~636 mil".
const approxPop = (n) => {
  if (n >= 1e6) {
    const m = n / 1e6;
    const r = m >= 10 ? Math.round(m) : Math.round(m * 10) / 10;
    return `~${millionFormatter.format(r)} mi`;
  }
  return `~${formatter.format(Math.round(n / 1000))} mil`;
};

// Taxa de nupcialidade por 1 milhão de habitantes (casamentos acumulados / pop * 1e6).
const perMillion = (s) => (s.casamentos / s.pop) * 1e6;

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

// Extensão "robusta" do estado: amostra o contorno e corta os 4% extremos de
// cada lado, ignorando ilhas oceânicas distantes (Trindade no ES, Fernando de
// Noronha no PE) que inflam o bbox e jogam o centro no oceano.
const robustExtentInSvgSpace = (path) => {
  if (!mapSvg) return null;
  const total = path.getTotalLength?.();
  if (!total) return bboxInSvgSpace(path);

  const svgMatrix = mapSvg.getScreenCTM();
  const pathMatrix = path.getScreenCTM();
  if (!svgMatrix || !pathMatrix) return bboxInSvgSpace(path);

  const matrix = svgMatrix.inverse().multiply(pathMatrix);
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

  const at = (arr, t) => arr[Math.min(arr.length - 1, Math.max(0, Math.round(t * (arr.length - 1))))];
  const x0 = at(xs, 0.04);
  const x1 = at(xs, 0.96);
  const y0 = at(ys, 0.04);
  const y1 = at(ys, 0.96);
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
};

const targetViewBoxFor = (path) => {
  if (!fullViewBox || !mapSvg) return null;

  const box = robustExtentInSvgSpace(path);
  if (!box) return null;

  // Aspecto da área visível (a "tela" da moldura). O viewBox é forçado a casar
  // com ele, então o estado preenche as bordas sem letterbox.
  const aspect = mapSvg.clientWidth && mapSvg.clientHeight
    ? mapSvg.clientWidth / mapSvg.clientHeight
    : fullViewBox.width / fullViewBox.height;

  // Folga em volta do estado (maior = mais contexto da região ao redor).
  const stateShare = Math.max(box.width, box.height) / Math.max(fullViewBox.width, fullViewBox.height);
  const pad = stateShare < 0.06 ? 1.6 : 1.5;

  let width = box.width * pad;
  let height = box.height * pad;

  // Cresce o lado menor para casar o aspecto da moldura (preenche, não corta o estado).
  if (width / height > aspect) {
    height = width / aspect;
  } else {
    width = height * aspect;
  }

  // Piso de zoom: evita aproximar demais estados minúsculos (DF, SE, AL, RJ).
  const minHeight = fullViewBox.height * 0.40;
  if (height < minHeight) {
    height = minHeight;
    width = height * aspect;
  }
  // Sem teto: como o fundo é lavanda, a moldura pode passar dos limites do
  // Brasil. Isso deixa estados grandes (AM, PA) menores, com região em volta.

  // Centraliza no estado. Não prende ao bbox do Brasil: como o fundo do mapa é
  // lavanda, deixar a moldura passar da costa mantém o estado no centro (em vez
  // de empurrá-lo para um canto). O viés vertical sobe um pouco o estado, já que
  // o card cobre a base da moldura.
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  return {
    x: centerX - width / 2,
    y: centerY - height * 0.38,
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

// Enquadramento do país inteiro: expande o viewBox do Brasil para o aspecto da
// moldura (com folga), garantindo que todo o mapa caiba, com viés para cima para
// não ficar atrás do card.
const countryViewBox = () => {
  if (!fullViewBox || !mapSvg) return fullViewBox;
  const aspect = mapSvg.clientWidth && mapSvg.clientHeight
    ? mapSvg.clientWidth / mapSvg.clientHeight
    : fullViewBox.width / fullViewBox.height;
  let width = fullViewBox.width * 1.08;
  let height = fullViewBox.height * 1.08;
  if (width / height > aspect) {
    height = width / aspect;
  } else {
    width = height * aspect;
  }
  const centerX = fullViewBox.x + fullViewBox.width / 2;
  const centerY = fullViewBox.y + fullViewBox.height / 2;
  return { x: centerX - width / 2, y: centerY - height * 0.34, width, height };
};

const selectBrasil = () => {
  document.querySelectorAll(".map path").forEach((path) => {
    path.classList.remove("active", "dimmed");
    path.style.fillOpacity = "0.96";
  });
  animateViewBox(countryViewBox());

  const totals = orderedStates.reduce(
    (acc, s) => {
      acc.casamentos += s.casamentos;
      acc.homem += s.homem;
      acc.mulher += s.mulher;
      acc.pop += s.pop;
      return acc;
    },
    { casamentos: 0, homem: 0, mulher: 0, pop: 0 }
  );

  els.rank.textContent = "Panorama nacional · 2013–2024";
  els.name.textContent = "Brasil";
  els.flag.hidden = true;
  els.rate.textContent = rateFormatter.format((totals.casamentos / totals.pop) * 1e6);
  els.total.textContent = formatter.format(totals.casamentos);
  els.men.textContent = formatter.format(totals.homem);
  els.women.textContent = formatter.format(totals.mulher);
  els.note.textContent = `${approxPop(totals.pop)} era a população do país estimada pelo IBGE em 2024.`;

  document.querySelectorAll(".step").forEach((step) => {
    step.classList.toggle("active", step.dataset.id === "brasil");
  });
};

const selectState = (id) => {
  if (String(id) === "brasil") {
    selectBrasil();
    return;
  }

  const state = stateById.get(String(id));
  if (!state) return;

  document.querySelectorAll(".map path").forEach((path) => {
    path.classList.toggle("active", path.id === String(id));
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
  els.rate.textContent = rateFormatter.format(perMillion(state));
  els.total.textContent = formatter.format(state.casamentos);
  els.men.textContent = formatter.format(state.homem);
  els.women.textContent = formatter.format(state.mulher);
  els.note.textContent = `${approxPop(state.pop)} era a população total estimada pelo IBGE em 2024.`;

  document.querySelectorAll(".step").forEach((step) => {
    step.classList.toggle("active", step.dataset.id === String(id));
  });
};

const buildSteps = () => {
  els.steps.innerHTML = orderedStates
    .map((state, index) => `
      <article class="step" data-id="${state.ide}">
        <p class="rank">${positionLabelFor(index)} · ${rateFormatter.format(perMillion(state))} por 1 mi hab.</p>
        <h3>${state.estado}</h3>
      </article>
    `)
    .join("") + `
      <article class="step" data-id="brasil">
        <p class="rank">Panorama nacional</p>
        <h3>Brasil</h3>
      </article>
    `;

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

document.querySelector(".to-top")?.addEventListener("click", () => {
  document.querySelector(".experience-frame")?.scrollTo({ top: 0, behavior: "smooth" });
  window.scrollTo({ top: 0, behavior: "smooth" });
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
