# Casou onde? / hecho a mano

Idiomas: [🇧🇷 Português](https://github.com/todearaujo/mjda/blob/main/LEIAME.md) · [🇺🇸 English](https://github.com/todearaujo/mjda/blob/main/README.md) · [🇪🇸 Español](https://github.com/todearaujo/mjda/blob/main/LEEME.md)

## Objetivo comunicativo

Esta carpeta preserva el mapa original como museo del trabajo inicial.

## Técnica

La pieza original usa HTML, CSS, JavaScript, el SVG [bruf.svg](bruf.svg) y los JSON [porestado.json](porestado.json), [porgenero.json](porgenero.json) y [estados.json](estados.json).

## Datos

Los datos preservados cubren 2013 a 2020, como en la pieza original, con SIDRA/IBGE tabla 4406 indicada como fuente. No se modificaron aquí para conservar el registro histórico.

## Limitaciones

Esta versión mantiene decisiones y limitaciones originales: datos antiguos, autoplay simple y documentación menos explícita del cálculo y la fuente.

## Cómo ejecutar

Desde la raíz del repositorio, ejecuta `python3 -m http.server 8000` y abre `http://localhost:8000/mapa/codei-na-unha/`.
