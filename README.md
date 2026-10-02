# MediCycle Frontend — Organized Stitch Export

This folder contains the exported Stitch screens organized as a single static frontend project.

## Structure

- `index.html` — prototype launcher
- `*.html` — individual interactive HTML screens at repository root
- `previews/` — exported screenshots for reference
- `docs/DESIGN.md` — Stitch design notes

## Important

The exported screens currently load Tailwind CSS, Google Fonts, and Material Symbols from external CDNs, so the hosted demo needs an internet connection.

## Run locally

Because the pages use browser assets and relative paths, serve this folder with a local HTTP server rather than opening files directly.

For example with Python:

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000`

## GitHub

Upload the contents of this folder to a GitHub repository.

For a static demo, GitHub Pages can host it directly. Vercel or Netlify are also options.

## Next development step

1. Connect the Stitch screens with real navigation.
2. Add shared navigation/components where appropriate.
3. Replace dummy interactions/data with API calls later.
4. Connect the frontend to a Python backend (FastAPI/Flask) when the backend is ready.


## Navigation

`navigation.js` adds the prototype-level navigation layer. The exported Stitch visuals and inline micro-interactions remain in each page; the script connects the main workflow CTAs, role navigation bars, login, profile, wallet, return flow, pharmacy flow, and driver flow.

This is still a static frontend prototype. The buttons use local page navigation and mock/demo data. The later Python backend can replace those demo actions through API calls without requiring a visual redesign.


## GitHub Pages layout

All `.html` screens and `navigation.js` are intentionally at the repository root for a simple GitHub Pages deployment.
