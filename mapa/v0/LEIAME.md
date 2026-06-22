# Casou onde? / v0

Idiomas: [Português](LEIAME.md) · [English](README.md) · [Español](LEEME.md)

## Objetivo comunicativo

A v0 é uma melhoria direta do mapa original: deixa o painel mais claro, explicita escala/fonte e conduz a leitura por autoplay.

## Técnica

HTML, CSS e JavaScript estáticos. O mapa é carregado de `../shared/bruf.svg`; os dados vêm de `../shared/casou-onde.json`.

## Dados

Casamentos entre cônjuges masculinos e femininos: SIDRA/IBGE tabela 4406, variáveis 4373 e 4374, por UF, acumulados de 2013 a 2024. População: SIDRA/IBGE tabela 6579, variável 9324, ano 2024.

## Limitações

O indicador principal é uma taxa acumulada: casamentos de 2013 a 2024 por população estimada em 2024. Isso favorece comparação territorial simples, mas não descreve evolução anual nem residência dos casais.

## Como rodar

Na raiz do repositório, rode `python3 -m http.server 8000` e acesse `http://localhost:8000/mapa/v0/`.
