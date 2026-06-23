# Codei na unha

Idiomas: [🇧🇷 Português](LEIAME.md) | [🇺🇸 English](README.md) | [🇪🇸 Español](LEEME.md)

Volver al [índice de scroll](../).

## Objetivo comunicativo

Esta experiencia compara la altura física de los Google Phones con una regla visual. La intención es mantener la sensación hecha a mano: el usuario hace scroll, el teléfono cambia y la regla da la escala.

## Técnica

- HTML, CSS y JavaScript puro.
- La medición sigue basada en secciones de scroll de una pantalla por dispositivo.
- Las imágenes viven en `images/`, preservadas junto con la experiencia.
- La regla es un fondo fijo en `#phones`, alineado por la base.

## Bug corregido

La versión original dependía de `100vh` y `height: 100%` en elementos fijos. En iOS y navegadores móviles con barra inferior dinámica, eso podía desplazar la regla y dejar inestable el "suelo" visual.

La versión actual usa:

- `svh`/`dvh` en CSS cuando están disponibles.
- La variable `--viewport-height` como fallback.
- `visualViewport.height` en JavaScript para actualizar la altura real cuando cambia la interfaz del navegador.

## Mejoras de orientación

- Mini progreso fijo arriba.
- Indicación inicial "Role para medir".
- Nota metodológica discreta al final.

## Estructura

- `index.html`: narrativa y slides.
- `scroll.css`: layout, regla, dispositivos y corrección de viewport.
- `scroll.js`: lógica de scroll, progreso y actualización del viewport.
- `images/`: assets de la regla, marca, Android y teléfonos.

## Cómo ejecutar

Desde la raíz del repositorio:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000/scroll/codei-na-unha/`.

## Limitaciones

La comparación usa imágenes y alturas declaradas, no una renderización física calibrada por densidad real de pantalla. En navegadores muy antiguos sin `visualViewport`, el fallback vuelve a `innerHeight`/`100vh`.
