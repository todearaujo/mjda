import { writeFile } from "node:fs/promises";

const MARRIAGE_URL =
  "https://apisidra.ibge.gov.br/values/t/4406/n3/all/v/4373,4374/p/all/c236/0/c664/0/c665/0/c666/0/c667/0?formato=json";
const POPULATION_URL =
  "https://apisidra.ibge.gov.br/values/t/6579/n3/all/v/9324/p/2024?formato=json";

const states = [
  { id: 11, uf: "RO", estado: "Rondonia", nome: "Rondônia", regiao: "Norte" },
  { id: 12, uf: "AC", estado: "Acre", nome: "Acre", regiao: "Norte" },
  { id: 13, uf: "AM", estado: "Amazonas", nome: "Amazonas", regiao: "Norte" },
  { id: 14, uf: "RR", estado: "Roraima", nome: "Roraima", regiao: "Norte" },
  { id: 15, uf: "PA", estado: "Para", nome: "Pará", regiao: "Norte" },
  { id: 16, uf: "AP", estado: "Amapa", nome: "Amapá", regiao: "Norte" },
  { id: 17, uf: "TO", estado: "Tocantins", nome: "Tocantins", regiao: "Norte" },
  { id: 21, uf: "MA", estado: "Maranhao", nome: "Maranhão", regiao: "Nordeste" },
  { id: 22, uf: "PI", estado: "Piaui", nome: "Piauí", regiao: "Nordeste" },
  { id: 23, uf: "CE", estado: "Ceara", nome: "Ceará", regiao: "Nordeste" },
  { id: 24, uf: "RN", estado: "Rio Grande do Norte", nome: "Rio Grande do Norte", regiao: "Nordeste" },
  { id: 25, uf: "PB", estado: "Paraiba", nome: "Paraíba", regiao: "Nordeste" },
  { id: 26, uf: "PE", estado: "Pernambuco", nome: "Pernambuco", regiao: "Nordeste" },
  { id: 27, uf: "AL", estado: "Alagoas", nome: "Alagoas", regiao: "Nordeste" },
  { id: 28, uf: "SE", estado: "Sergipe", nome: "Sergipe", regiao: "Nordeste" },
  { id: 29, uf: "BA", estado: "Bahia", nome: "Bahia", regiao: "Nordeste" },
  { id: 31, uf: "MG", estado: "Minas Gerais", nome: "Minas Gerais", regiao: "Sudeste" },
  { id: 32, uf: "ES", estado: "Espirito Santo", nome: "Espírito Santo", regiao: "Sudeste" },
  { id: 33, uf: "RJ", estado: "Rio de Janeiro", nome: "Rio de Janeiro", regiao: "Sudeste" },
  { id: 35, uf: "SP", estado: "Sao Paulo", nome: "São Paulo", regiao: "Sudeste" },
  { id: 41, uf: "PR", estado: "Parana", nome: "Paraná", regiao: "Sul" },
  { id: 42, uf: "SC", estado: "Santa Catarina", nome: "Santa Catarina", regiao: "Sul" },
  { id: 43, uf: "RS", estado: "Rio Grande do Sul", nome: "Rio Grande do Sul", regiao: "Sul" },
  { id: 50, uf: "MS", estado: "Mato Grosso do Sul", nome: "Mato Grosso do Sul", regiao: "Centro-Oeste" },
  { id: 51, uf: "MT", estado: "Mato Grosso", nome: "Mato Grosso", regiao: "Centro-Oeste" },
  { id: 52, uf: "GO", estado: "Goias", nome: "Goiás", regiao: "Centro-Oeste" },
  { id: 53, uf: "DF", estado: "Distrito Federal", nome: "Distrito Federal", regiao: "Centro-Oeste" }
];

const numberFromSidra = (value) => (value === "-" || value === "..." ? 0 : Number(value));

const readSidra = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SIDRA request failed ${response.status}: ${url}`);
  }
  const rows = await response.json();
  return rows.slice(1);
};

const [marriageRows, populationRows] = await Promise.all([
  readSidra(MARRIAGE_URL),
  readSidra(POPULATION_URL)
]);

const byState = new Map(states.map((state) => [String(state.id), {
  ...state,
  casamentos: 0,
  homem: 0,
  mulher: 0,
  anos: {}
}]));

for (const row of marriageRows) {
  const state = byState.get(row.D1C);
  if (!state) continue;

  const year = row.D3C;
  const value = numberFromSidra(row.V);
  const genderKey = row.D2C === "4373" ? "homem" : "mulher";

  state[genderKey] += value;
  state.casamentos += value;
  state.anos[year] ||= { homem: 0, mulher: 0, total: 0 };
  state.anos[year][genderKey] += value;
  state.anos[year].total += value;
}

for (const row of populationRows) {
  const state = byState.get(row.D1C);
  if (state) state.pop = numberFromSidra(row.V);
}

const values = [...byState.values()];
const maxRate = Math.max(...values.map((state) => state.casamentos / state.pop));
const maxTotal = Math.max(...values.map((state) => state.casamentos));

const estados = values
  .map((state) => ({
    estado: state.nome,
    uf: state.uf,
    ide: state.id,
    regiao: state.regiao,
    casamentos: state.casamentos,
    homem: state.homem,
    mulher: state.mulher,
    pop: state.pop,
    cp100: Number(((state.casamentos / state.pop) * 100000).toFixed(1)),
    indice: Number(((state.casamentos / state.pop) / maxRate).toFixed(3)),
    indiceTotal: Number((state.casamentos / maxTotal).toFixed(3)),
    anos: state.anos
  }))
  .sort((a, b) => a.cp100 - b.cp100 || a.casamentos - b.casamentos);

const metadata = {
  title: "Casou onde?",
  updatedAt: new Date().toISOString(),
  mainMetric: "cp100",
  latestMarriageYear: 2024,
  marriageYears: [2013, 2024],
  populationYear: 2024,
  source: [
    {
      name: "SIDRA IBGE tabela 4406",
      url: "https://sidra.ibge.gov.br/tabela/4406",
      api: MARRIAGE_URL,
      variables: {
        "4373": "Numero de casamentos entre conjuges masculinos",
        "4374": "Numero de casamentos entre conjuges femininos"
      }
    },
    {
      name: "SIDRA IBGE tabela 6579",
      url: "https://sidra.ibge.gov.br/tabela/6579",
      api: POPULATION_URL,
      variables: {
        "9324": "Populacao residente estimada"
      }
    }
  ],
  notes: [
    "Casamentos acumulados por lugar do registro, UF, 2013-2024.",
    "Taxa cp100 = casamentos acumulados de 2013-2024 / populacao estimada de 2024 * 100000.",
    "No SIDRA, '-' foi tratado como zero."
  ]
};

await writeFile("mapa/shared/casou-onde.json", `${JSON.stringify({ metadata, estados }, null, 2)}\n`);

const legacyPorEstado = estados.map((state) => ({
  estado: state.estado,
  uf: state.uf,
  ide: state.ide,
  casamentos: state.casamentos,
  pop: state.pop,
  cp100: state.cp100,
  indice: state.indice
}));

const legacyPorGenero = estados.flatMap((state) => [
  { ide: state.ide, genero: "Homem", casamentos: state.homem },
  { ide: state.ide, genero: "Mulher", casamentos: state.mulher }
]);

await writeFile("mapa/shared/porestado.json", `${JSON.stringify(legacyPorEstado, null, 2)}\n`);
await writeFile("mapa/shared/porgenero.json", `${JSON.stringify(legacyPorGenero, null, 2)}\n`);
console.log(`Updated ${estados.length} states. Latest marriage year: 2024.`);
