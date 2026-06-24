# Casou onde? / map

Languages: [🇧🇷 Português](https://github.com/todearaujo/mjda/blob/main/LEIAME.md) · [🇺🇸 English](https://github.com/todearaujo/mjda/blob/main/README.md) · [🇪🇸 Español](https://github.com/todearaujo/mjda/blob/main/LEEME.md)

## Communication goal

This folder organizes the map-format versions of "Casou onde?", an MJDA¹ experience about same-gender marriages registered in Brazilian civil registry offices.

¹ Master em Jornalismo de Dados, Automação e Data Storytelling (Master in Data Journalism, Automation and Data Storytelling).

## Versions

- [codei-na-unha](codei-na-unha/): museum copy of the original piece.
- [v0](v0/): direct map with panel, scale, and autoplay.
- [v1](v1/): map with scrollytelling.

## Technique

Everything is static and GitHub Pages friendly: HTML, CSS, JavaScript, SVG, and local JSON. Shared data lives in [shared/casou-onde.json](shared/casou-onde.json).

## Data

Main source: SIDRA/IBGE table 4406, variables 4373 and 4374, by state and year. This cut aggregates 2013 to 2024, the latest year found in the API. The main rate uses 2024 estimated population from SIDRA/IBGE table 6579, variable 9324.

Reproducible query:

```bash
node mapa/_scripts/update-data.mjs
```

## Limitations

The rate per 100,000 inhabitants uses 2024 population as a fixed denominator for the 2013-2024 cumulative count. Records are grouped by place of registration, not by the couple's residence. In SIDRA, "-" values were treated as zero.

## How to run

From the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/mapa/`.
