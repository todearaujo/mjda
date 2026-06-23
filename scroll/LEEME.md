# Scroll

Idiomas: [🇧🇷 Português](LEIAME.md) | [🇺🇸 English](README.md) | [🇪🇸 Español](LEEME.md)

## Objetivo

Este directorio ahora es el índice de experiencias de scrollytelling de MJDA. Mantiene GitHub Pages estático y enlaza piezas independientes.

## Experiencias

- [Codei na unha](codei-na-unha/): una regla visual sobre la evolución de tamaño de los Google Phones.

## Técnica

- HTML, CSS y JavaScript puro.
- Sin build, dependencias locales ni enrutamiento dinámico.
- Cada experiencia puede tener sus propios assets, estilos y documentación.

## Estructura

- `index.html`: índice público del formato scroll.
- `index.css`: estilos del índice.
- `LEIAME.md`, `README.md`, `LEEME.md`: documentación del índice.
- `codei-na-unha/`: experiencia preservada y ajustada.

## Cómo ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000/scroll/`.

## Limitaciones

El índice es una lista estática. Las nuevas experiencias deben agregarse manualmente al HTML y a los README.
