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


## Live FastAPI authentication integration

The login screen now calls the Python backend's existing `POST /api/auth/login` endpoint and stores the returned bearer token in `sessionStorage` for the current browser-tab session. Authenticated frontend requests can use `MediCycleAuth.request(path, options)`; the client automatically adds the bearer token. `MediCycleAuth.me()` calls `GET /api/users/me`, and logout clears the local session.

### Configure the API URL

Edit `api-config.js` and set `window.MEDICYCLE_API_BASE_URL` to the deployed FastAPI service origin (for example, the Render service's `https://…onrender.com` origin). The committed default is `http://127.0.0.1:8000` for local development; GitHub Pages cannot reach a developer's localhost.

The backend must allow the GitHub Pages origin in `CORS_ORIGINS`. The Python API currently allows `https://sakshamthakur960-source.github.io` in its example configuration. Keep the API on HTTPS in production.

### Current backend capability boundaries

- Household email/mobile + password login is connected.
- OTP, biometric, and partner-pharmacy authentication are not implemented by the current FastAPI authentication endpoints. The prototype now displays a clear message instead of pretending those flows succeeded.
- The remaining Stitch screens are still prototype screens; this change does not falsely claim that every screen is backed by live API data.
- The backend issues 60-minute bearer tokens by default. The frontend keeps the token in `sessionStorage`, not persistent local storage or a JavaScript-readable cookie.
