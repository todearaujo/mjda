# Casou onde? / v1

Languages: [🇧🇷 Português](https://github.com/todearaujo/mjda/blob/main/LEIAME.md) · [🇺🇸 English](https://github.com/todearaujo/mjda/blob/main/README.md) · [🇪🇸 Español](https://github.com/todearaujo/mjda/blob/main/LEEME.md)

## Communication goal

v1 turns the map into a guided reading: each scroll step highlights one state and fills the data card, ordered from the lowest to the highest main value.

## Technique

Static HTML, CSS, and JavaScript. The narrative is generated from `../shared/casou-onde.json`; highlighting uses `IntersectionObserver` and the `../shared/bruf.svg` SVG.

## Data

Marriages between male spouses and female spouses: SIDRA/IBGE table 4406, variables 4373 and 4374, by state, aggregated from 2013 to 2024. Population: SIDRA/IBGE table 6579, variable 9324, year 2024.

## Limitations

The scroll emphasizes territorial ranking by cumulative rate. The reading does not infer causality, social acceptance, or couples' residence.

## How to run

From the repository root, run `python3 -m http.server 8000` and open `http://localhost:8000/mapa/v1/`.
