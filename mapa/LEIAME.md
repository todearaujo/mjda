# Casou onde? / mapa

Idiomas: [🇧🇷 Português](LEIAME.md) · [🇺🇸 English](README.md) · [🇪🇸 Español](LEEME.md)

## Objetivo comunicativo

Este diretório organiza as versões em formato mapa de "Casou onde?", uma experiência do MJDA¹ sobre casamentos entre pessoas do mesmo gênero registrados em cartórios brasileiros.

¹ Master em Jornalismo de Dados, Automação e Data Storytelling (Master in Data Journalism, Automation and Data Storytelling).

## Versões

- [codei-na-unha](codei-na-unha/): museu da peça original.
- [v0](v0/): mapa direto com painel, escala e autoplay.
- [v1](v1/): mapa com scrollytelling.

## Técnica

Tudo é estático e compatível com GitHub Pages: HTML, CSS, JavaScript, SVG e JSON local. Os dados compartilhados ficam em [shared/casou-onde.json](shared/casou-onde.json).

## Dados

Fonte principal: SIDRA/IBGE tabela 4406, variáveis 4373 e 4374, por UF e ano. O recorte usado acumula 2013 a 2024, o ano mais recente encontrado na API. A taxa principal usa a população estimada de 2024 da SIDRA/IBGE tabela 6579, variável 9324.

Consulta reprodutível:

```bash
node mapa/_scripts/update-data.mjs
```

## Limitações

A taxa por 100 mil habitantes usa população de 2024 como denominador fixo para o acumulado de 2013 a 2024. Os registros são por lugar do registro, não por local de residência do casal. No SIDRA, valores "-" foram tratados como zero.

## Como rodar

Na raiz do repositório:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000/mapa/`.
