# Codei na unha

Languages: [🇧🇷 Português](https://github.com/todearaujo/mjda/blob/main/LEIAME.md) | [🇺🇸 English](https://github.com/todearaujo/mjda/blob/main/README.md) | [🇪🇸 Español](https://github.com/todearaujo/mjda/blob/main/LEEME.md)

Back to the [scroll index](../).

## Communication goal

This experience compares the physical height of Google Phones with a visual ruler. The point is to keep the handmade feel: the user scrolls, the phone changes, and the ruler gives scale.

## Technique

- Plain HTML, CSS, and JavaScript.
- Measurement still depends on one viewport-height scroll section per device.
- Images live in `images/`, preserved with the experience.
- The ruler is a fixed background on `#phones`, aligned to the bottom.

## Fixed bug

The original version depended on `100vh` and `height: 100%` for fixed elements. On iOS and mobile browsers with dynamic bottom bars, that could move the ruler and make the visual floor unstable.

The current version uses:

- CSS `svh`/`dvh` where available.
- A `--viewport-height` variable as fallback.
- `visualViewport.height` in JavaScript to update the real height when browser chrome changes.

## Orientation improvements

- Small fixed progress indicator.
- Initial "Role para medir" prompt.
- Subtle methodology note at the end.

## Structure

- `index.html`: story and slides.
- `scroll.css`: layout, ruler, devices, and viewport fix.
- `scroll.js`: scroll logic, progress, and viewport updates.
- `images/`: ruler, brand, Android, and phone assets.

## How to run

From the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/scroll/codei-na-unha/`.

## Limitations

The comparison uses images and declared heights, not a physically calibrated rendering based on actual display density. In very old browsers without `visualViewport`, the fallback returns to `innerHeight`/`100vh`.
