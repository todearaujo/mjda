# Casou onde? / v0

Languages: [🇧🇷 Português](LEIAME.md) · [🇺🇸 English](README.md) · [🇪🇸 Español](LEEME.md)

## Communication goal

v0 is a direct improvement of the original map: it clarifies the panel, exposes the scale/source, and guides reading through autoplay.

## Technique

Static HTML, CSS, and JavaScript. The map is loaded from `../shared/bruf.svg`; data comes from `../shared/casou-onde.json`.

## Data

Marriages between male spouses and female spouses: SIDRA/IBGE table 4406, variables 4373 and 4374, by state, aggregated from 2013 to 2024. Population: SIDRA/IBGE table 6579, variable 9324, year 2024.

## Limitations

The main indicator is a cumulative rate: 2013-2024 marriages over 2024 estimated population. This supports simple territorial comparison, but does not describe annual evolution or couples' residence.

## How to run

From the repository root, run `python3 -m http.server 8000` and open `http://localhost:8000/mapa/v0/`.
