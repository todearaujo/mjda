# Pendências — sessão 2026-06-23

Anotações do que ficou em aberto para retomarmos na próxima sessão.

## Status da branch
- A branch `claude/compassionate-gates-tb4ayn` estava faltando no remoto e foi
  publicada nesta sessão.
- Ela está 4 commits à frente da `main`:
  - `909810a` Merge pull request #4 from todearaujo/claude/relaxed-rubin-n8whdv
  - `834ffc3` Mapa v1: zoom full-bleed até as bordas da moldura
  - `7329015` Refactor MJDA docs and preserve museum content
  - `8a6355d` Update doc links and metadata across MJDA pages

## A revisar / conversar
- [ ] **Calculadora (`calc/v0/`)** — retrabalho grande (CSS ~995 linhas, `index.html`
      e `app.js` reescritos). Revisar o que mudou e validar comportamento.
- [ ] **Mapa (`mapa/v1/`)** — ajuste de "zoom full-bleed até as bordas da moldura"
      (`app.js`, `style.css`, `index.html`). Confirmar visual.
- [ ] **Favicon** — `favicon.ico` foi substituído por `favicon.png`. Confirmar que
      todas as páginas referenciam o arquivo certo.
- [ ] **Docs (LEEME/LEIAME/README)** — vários atualizados em mapa, scroll e calc.
      Revisar consistência dos links e metadados.

## Itens em aberto da conversa
- [ ] Verificar se existe algum diretório/recurso "calc/0" esperado (foi perguntado;
      hoje só existe `calc/` e `calc/v0/`).
