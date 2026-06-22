# Casou onde? / mapa

Idiomas: [Português](LEIAME.md) · [English](README.md) · [Español](LEEME.md)

## Objetivo comunicativo

Esta carpeta organiza las versiones en formato mapa de "Casou onde?", una experiencia del MJDA¹ sobre matrimonios entre personas del mismo género registrados en oficinas de registro civil brasileñas.

¹ Master em Jornalismo de Dados, Automação e Data Storytelling (Master in Data Journalism, Automation and Data Storytelling).

## Versiones

- [codei-na-unha](codei-na-unha/): museo de la pieza original.
- [v0](v0/): mapa directo con panel, escala y autoplay.
- [v1](v1/): mapa con scrollytelling.

## Técnica

Todo es estático y compatible con GitHub Pages: HTML, CSS, JavaScript, SVG y JSON local. Los datos compartidos están en [shared/casou-onde.json](shared/casou-onde.json).

## Datos

Fuente principal: SIDRA/IBGE tabla 4406, variables 4373 y 4374, por estado y año. El recorte usado acumula 2013 a 2024, el año más reciente encontrado en la API. La tasa principal usa la población estimada de 2024 de SIDRA/IBGE tabla 6579, variable 9324.

Consulta reproducible:

```bash
node mapa/_scripts/update-data.mjs
```

## Limitaciones

La tasa por 100 mil habitantes usa la población de 2024 como denominador fijo para el acumulado de 2013 a 2024. Los registros se agrupan por lugar de registro, no por residencia de la pareja. En SIDRA, los valores "-" fueron tratados como cero.

## Cómo ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000/mapa/`.
