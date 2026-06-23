# Codei na unha

Idiomas: [🇧🇷 Português](LEIAME.md) | [🇺🇸 English](README.md) | [🇪🇸 Español](LEEME.md)

Voltar ao [índice de scroll](../).

## Objetivo comunicativo

Esta experiência compara a altura física dos Google Phones em uma régua visual. A graça é manter a sensação de peça feita à mão: o usuário rola, o telefone muda, a régua dá a escala.

## Técnica

- HTML, CSS e JavaScript puro.
- A medição continua baseada em seções de scroll de uma tela por aparelho.
- As imagens ficam em `images/`, preservadas junto da experiência.
- A régua é um fundo fixo em `#phones`, alinhado pela base.

## Bug corrigido

A versão original dependia de `100vh` e `height: 100%` em elementos fixos. Em iOS e navegadores mobile com barra inferior dinâmica, isso podia deslocar a régua e deixar o "chão" visual instável.

A versão atual usa:

- `svh`/`dvh` via CSS quando disponíveis.
- Variável `--viewport-height` como fallback.
- `visualViewport.height` em JavaScript para atualizar a altura real quando a barra do navegador muda.

## Melhorias de orientação

- Mini progresso fixo no topo.
- Chamada inicial de "Role para medir".
- Nota metodológica discreta no encerramento.

## Estrutura

- `index.html`: narrativa e slides.
- `scroll.css`: layout, régua, aparelhos e correção de viewport.
- `scroll.js`: lógica de scroll, progresso e atualização do viewport.
- `images/`: assets da régua, marca, Android e telefones.

## Como rodar

Na raiz do repositório:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000/scroll/codei-na-unha/`.

## Limitações

A comparação usa imagens e alturas declaradas, não uma renderização física calibrada por densidade real de tela. Em navegadores muito antigos sem `visualViewport`, o fallback volta para `innerHeight`/`100vh`.
