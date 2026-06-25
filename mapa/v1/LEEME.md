# Casou onde? / v1

Idiomas: [🇧🇷 Português](LEIAME.md) · [🇺🇸 English](README.md) · [🇪🇸 Español](LEEME.md)

## Objetivo comunicativo

La v1 convierte el mapa en una lectura guiada: cada tramo del scroll destaca un estado y llena el cuadro de datos, ordenado del menor al mayor valor principal.

## Técnica

HTML, CSS y JavaScript estáticos. La narrativa se genera desde `../shared/casou-onde.json`; la cámara del SVG `../shared/bruf.svg` acompaña el scroll, con controles anterior/siguiente, navegación por teclado y un cuadro de datos con vidrio esmerilado sobre el mapa. El experimento de scroll-snap sigue disponible con `?snap`.

## Datos

Matrimonios entre cónyuges masculinos y femeninos: SIDRA/IBGE tabla 4406, variables 4373 y 4374, por estado, acumulados de 2013 a 2024. Población: SIDRA/IBGE tabla 6579, variable 9324, año 2024.

## Limitaciones

El scroll enfatiza un ranking territorial por tasa acumulada. La lectura no intenta inferir causalidad, aceptación social ni residencia de las parejas.

## Cómo ejecutar

Desde la raíz del repositorio, ejecuta `python3 -m http.server 8000` y abre `http://localhost:8000/mapa/v1/`.
