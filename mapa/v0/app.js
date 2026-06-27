const formatter = new Intl.NumberFormat("pt-BR");
const rateFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const stateById = new Map();
let orderedStates = [];
let currentIndex = 0;
let timer = null;
let isPlaying = true;

const els = {
  map: document.querySelector("#mapa"),
  name: document.querySelector("#state-name"),
  region: document.querySelector("#state-region"),
  rate: document.querySelector("#state-rate"),
  total: document.querySelector("#state-total"),
  men: document.querySelector("#state-men"),
  women: document.querySelector("#state-women"),
  playToggle: document.querySelector("#play-toggle")
};

const colorFor = (indice) => {
  const hue = 338 - Math.round(indice * 32);
  const light = 90 - Math.round(indice * 44);
  const saturation = 72 + Math.round(indice * 12);
  return `hsl(${hue} ${saturation}% ${light}%)`;
};

const stopAutoplay = () => {
  clearInterval(timer);
  timer = null;
};

const startAutoplay = () => {
  stopAutoplay();
  timer = setInterval(() => {
    currentIndex = (currentIndex + 1) % orderedStates.length;
    selectState(orderedStates[currentIndex].ide);
  }, 2600);
};

const updatePlayButton = () => {
  els.playToggle.textContent = isPlaying ? "Pausar autoplay" : "Continuar autoplay";
};

const selectState = (id) => {
  const state = stateById.get(String(id));
  if (!state) return;

  currentIndex = orderedStates.findIndex((item) => item.ide === state.ide);
  document.querySelector(".map path.active")?.classList.remove("active");

  const path = document.getElementById(String(state.ide));
  path?.classList.add("active");
  path?.parentElement.appendChild(path);

  els.name.textContent = `${state.estado} (${state.uf})`;
  els.region.textContent = `${state.regiao} · população estimada de ${formatter.format(state.pop)} pessoas em 2024`;
  els.rate.textContent = rateFormatter.format(state.taxaPorMilhao ?? state.cp100);
  els.total.textContent = formatter.format(state.casamentos);
  els.men.textContent = formatter.format(state.homem);
  els.women.textContent = formatter.format(state.mulher);
};

const wireMap = () => {
  document.querySelectorAll(".map path").forEach((path) => {
    const state = stateById.get(path.id);
    if (!state) return;

    path.dataset.uf = state.uf;
    path.setAttribute("fill", colorFor(state.indice));
    path.setAttribute("fill-opacity", "0.96");
    path.setAttribute("role", "button");
    path.setAttribute("tabindex", "0");
    path.setAttribute("aria-label", `${state.estado}: ${rateFormatter.format(state.taxaPorMilhao ?? state.cp100)} por 1 milhão de habitantes`);

    const choose = () => {
      selectState(state.ide);
      if (isPlaying) {
        isPlaying = false;
        stopAutoplay();
        updatePlayButton();
      }
    };

    path.addEventListener("pointerenter", choose);
    path.addEventListener("click", choose);
    path.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        choose();
      }
    });
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
  selectState(orderedStates[0].ide);
  updatePlayButton();
  startAutoplay();
};

els.playToggle.addEventListener("click", () => {
  isPlaying = !isPlaying;
  updatePlayButton();
  if (isPlaying) {
    startAutoplay();
  } else {
    stopAutoplay();
  }
});

init().catch((error) => {
  els.name.textContent = "Não foi possível carregar os dados";
  console.error(error);
});
