# Scroll

Languages: [🇧🇷 Português](https://github.com/todearaujo/mjda/blob/main/LEIAME.md) | [🇺🇸 English](https://github.com/todearaujo/mjda/blob/main/README.md) | [🇪🇸 Español](https://github.com/todearaujo/mjda/blob/main/LEEME.md)

## Goal

This directory is now the index for MJDA scrollytelling experiences. It keeps GitHub Pages static and links to self-contained pieces.

## Experiences

- [Codei na unha](codei-na-unha/): a visual ruler about the size evolution of Google Phones.

## Technique

- Plain HTML, CSS, and JavaScript.
- No build step, local dependencies, or dynamic routing.
- Each experience can own its assets, styles, and documentation.

## Structure

- `index.html`: public index for the scroll format.
- `index.css`: index styling.
- `LEIAME.md`, `README.md`, `LEEME.md`: index documentation.
- `codei-na-unha/`: preserved and improved experience.

## How to run

From the repository root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/scroll/`.

## Limitations

The index is a static list. New experiences must be added manually to the HTML and README files.
