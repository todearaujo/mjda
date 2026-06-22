# Casou onde? / hand-coded

Languages: [Português](LEIAME.md) · [English](README.md) · [Español](LEEME.md)

## Communication goal

This folder preserves the original map as a museum copy of the first work.

## Technique

The original piece uses HTML, CSS, JavaScript, the [bruf.svg](bruf.svg) SVG, and the [porestado.json](porestado.json), [porgenero.json](porgenero.json), and [estados.json](estados.json) files.

## Data

The preserved data covers 2013 to 2020, as in the original piece, with SIDRA/IBGE table 4406 cited as the source. It was not changed here in order to keep the historical record.

## Limitations

This version keeps the original decisions and limitations: older data, simple autoplay, and less explicit calculation/source documentation.

## How to run

From the repository root, run `python3 -m http.server 8000` and open `http://localhost:8000/mapa/codei-na-unha/`.
