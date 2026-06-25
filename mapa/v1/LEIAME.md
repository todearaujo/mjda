# Casou onde? / v1

Idiomas: [🇧🇷 Português](LEIAME.md) · [🇺🇸 English](README.md) · [🇪🇸 Español](LEEME.md)

## Objetivo comunicativo

A v1 transforma o mapa em uma leitura guiada: cada trecho do scroll destaca uma UF e preenche o quadro com seus dados, do menor para o maior valor principal.

## Técnica

HTML, CSS e JavaScript estáticos. A narrativa é gerada a partir de `../shared/casou-onde.json`; a câmera do SVG `../shared/bruf.svg` acompanha o scroll, com controles anterior/próximo, navegação por teclado e um quadro de dados com vidro fosco sobre o mapa. O experimento de scroll-snap continua disponível por `?snap`.

## Dados

Casamentos entre cônjuges masculinos e femininos: SIDRA/IBGE tabela 4406, variáveis 4373 e 4374, por UF, acumulados de 2013 a 2024. População: SIDRA/IBGE tabela 6579, variável 9324, ano 2024.

## Limitações

O scroll enfatiza ranking territorial por taxa acumulada. A leitura não tenta inferir causalidade, aceitação social ou residência dos casais.

## Como rodar

Na raiz do repositório, rode `python3 -m http.server 8000` e acesse `http://localhost:8000/mapa/v1/`.
