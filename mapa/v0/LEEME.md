# Casou onde? / v0

Idiomas: [🇧🇷 Português](https://github.com/todearaujo/mjda/blob/main/LEIAME.md) · [🇺🇸 English](https://github.com/todearaujo/mjda/blob/main/README.md) · [🇪🇸 Español](https://github.com/todearaujo/mjda/blob/main/LEEME.md)

## Objetivo comunicativo

La v0 es una mejora directa del mapa original: aclara el panel, muestra escala/fuente y guía la lectura con autoplay.

## Técnica

HTML, CSS y JavaScript estáticos. El mapa se carga desde `../shared/bruf.svg`; los datos vienen de `../shared/casou-onde.json`.

## Datos

Matrimonios entre cónyuges masculinos y femeninos: SIDRA/IBGE tabla 4406, variables 4373 y 4374, por estado, acumulados de 2013 a 2024. Población: SIDRA/IBGE tabla 6579, variable 9324, año 2024.

## Limitaciones

El indicador principal es una tasa acumulada: matrimonios de 2013 a 2024 sobre población estimada en 2024. Sirve para comparación territorial simple, pero no describe evolución anual ni residencia de las parejas.

## Cómo ejecutar

Desde la raíz del repositorio, ejecuta `python3 -m http.server 8000` y abre `http://localhost:8000/mapa/v0/`.
