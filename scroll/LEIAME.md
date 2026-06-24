# Scroll

Idiomas: [🇧🇷 Português](https://github.com/todearaujo/mjda/blob/main/LEIAME.md) | [🇺🇸 English](https://github.com/todearaujo/mjda/blob/main/README.md) | [🇪🇸 Español](https://github.com/todearaujo/mjda/blob/main/LEEME.md)

## Objetivo

Este diretório virou o índice das experiências de scrollytelling do MJDA. Ele mantém o formato estático do GitHub Pages e aponta para peças independentes.

## Experiências

- [Codei na unha](codei-na-unha/): régua visual sobre a evolução de tamanho dos Google Phones.

## Técnica

- HTML, CSS e JavaScript puro.
- Sem build, dependências locais ou roteamento dinâmico.
- Cada experiência pode ter seus próprios assets, estilos e documentação.

## Estrutura

- `index.html`: índice público do formato scroll.
- `index.css`: estilo do índice.
- `LEIAME.md`, `README.md`, `LEEME.md`: documentação do índice.
- `codei-na-unha/`: experiência preservada e ajustada.

## Como rodar

Na raiz do repositório:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000/scroll/`.

## Limitações

O índice é apenas uma lista estática. Novas experiências precisam ser adicionadas manualmente ao HTML e aos READMEs.
