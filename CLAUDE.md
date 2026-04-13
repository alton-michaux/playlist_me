# Playlistify — Developer Guide

A Spotify playlist browser. Users can discover my playlists by genre, browse tracks, and view song details and listen to individual songs.

## Repository Structure

```
playlistify/              ← React 18 frontend (Create React App)
playlistify_backend/
playlistify_server/     ← Node.js + Express backend
```

---

## Architecture

All Spotify API calls go through the backend. The frontend never holds the Spotify client secret.

```
Frontend (localhost:3000)
    │
    ├── GET /token          → backend fetches Client Credentials token → returns { access_token }
    ├── GET /login          → backend builds Spotify auth URL → returns URL string
    ├── GET /genres         → backend proxies Spotify genres endpoint
    ├── GET /playlists      → backend proxies user playlists (user ID is server-side only)
    ├── GET /playlist       → backend proxies single playlist
    ├── GET /tracklist      → backend proxies playlist tracks
    └── GET /song           → backend proxies track info

OAuth flow:
    User clicks Log-In
    → frontend navigates to the URL returned by GET /login
    → Spotify authenticates user
    → Spotify redirects to 127.0.0.1:3000/callback?code=...&state=...
    → frontend calls GET /callback?code=...&state=...
    → backend validates state, exchanges code for tokens, returns Spotify user profile
```

---

## Local Dev Setup

### Prerequisites

- Node.js 18+ (LTS)
- A Spotify Developer app at developer.spotify.com/dashboard
  - Set **Redirect URI** to `http://127.0.0.1:3000/callback`
  - Note: Spotify banned `http://localhost` on April 9, 2025 — use `127.0.0.1` (IPv4) instead
  - Note your **Client ID**, **Client Secret**, and your Spotify **User ID**

### 1. Backend

```bash
cd playlistify_backend/playlistify_server
cp .env.example .env
# Fill in SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_USER_ID
npm run dev     # nodemon, auto-restarts on changes — http://localhost:3001
# or
npm start       # plain node
```

### 2. Frontend

```bash
cd playlistify
cp .env.example .env
# Set REACT_APP_BASE_URL=http://localhost:3001
npm start       # http://localhost:3000
```

---

## Environment Variables

### Backend (`playlistify_backend/playlistify_server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `3001`) |
| `SPOTIFY_CLIENT_ID` | From Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | From Spotify Developer Dashboard — **never exposed to the browser** |
| `SPOTIFY_REDIRECT_URI` | Must match Spotify dashboard exactly: `http://127.0.0.1:3000/callback` |
| `SPOTIFY_USER_ID` | Your Spotify username — used by the `/playlists` endpoint |
| `FRONTEND_URL` | Frontend origin used for CORS (default: `http://localhost:3000`) |

### Frontend (`playlistify/.env`)

| Variable | Description |
|---|---|
| `REACT_APP_BASE_URL` | Backend base URL (default: `http://localhost:3001`) |

---

## Backend API Endpoints

| Method | Path | Query params | Description |
|---|---|---|---|
| GET | `/api` | — | Health check |
| GET | `/login` | — | Returns Spotify auth URL (used as href on Log-In button) |
| GET | `/callback` | `code`, `state` | Exchanges auth code, returns Spotify user profile |
| GET | `/token` | — | Returns a Client Credentials access token |
| GET | `/genres` | `token` | Returns available genre seeds |
| GET | `/playlists` | `token` | Returns user's playlists (up to 21) |
| GET | `/playlist` | `playlistID`, `token` | Returns a single playlist |
| GET | `/tracklist` | `playlistID`, `token` | Returns a playlist's tracks |
| GET | `/song` | `trackID`, `token` | Returns track details |

---

## Frontend Tech Stack

- React 18 + Create React App (CRA)
- Blueprint.js 4.x (nav, icons, tooltips)
- React Bootstrap 2.x (layout, carousel, list groups)
- `@blueprintjs/popover2` 2.x (Tooltip2 in the toggle switch)
- react-router-dom 6.x (/, /callback, *)
- Axios (all HTTP calls)
- `useReducer` for state (no Redux)

### Consider migrating from CRA to Vite

CRA (`react-scripts`) is effectively unmaintained. It ships with a deeply locked dependency tree that carries ~23 unfixable audit vulnerabilities in its build toolchain (webpack, jest, svgo). `npm audit fix --force` would install `react-scripts@0.0.0` and break the build. None of these affect the production bundle, but it's noise and the toolchain is slow.

**Vite** is the recommended replacement: faster dev server (native ESM), faster builds, actively maintained, no legacy peer dep conflicts. Migration is straightforward for a project this size. Key changes:
- Replace `react-scripts` with `vite` + `@vitejs/plugin-react`
- Rename `index.html` to project root (out of `public/`)
- Rename env vars from `REACT_APP_*` to `VITE_*`, access via `import.meta.env.VITE_*`
- Replace `process.env.REACT_APP_BASE_URL` → `import.meta.env.VITE_BASE_URL`
- Blueprint.js v4 + React 18 peer dep conflict disappears with Vite (no legacy-peer-deps needed)

If rebuilding, start with Vite.

---

## Verification Checklist

1. `curl http://localhost:3001/api` → `{"status":"ok","service":"playlistify-backend"}`
2. `curl http://localhost:3001/token` → `{"access_token":"BQA..."}`
3. Visit `http://localhost:3001/login` in a browser → redirects to `accounts.spotify.com`
4. App loads at `http://localhost:3000` → genres dropdown populates, playlist cards appear
5. Click Log-In → Spotify auth → returns to `/callback` → nav shows your display name
6. Click a playlist → track list loads
7. Click a track → song detail panel loads

---

## WSL2 Networking Notes

This app is developed in WSL2. The browser runs on Windows; the servers run in WSL2. This creates two networking rules to keep in mind:

- **API calls from browser JS** must use `http://localhost:3001` — Windows proxies `localhost` to WSL2. Do NOT use `http://127.0.0.1:3001` here; Windows' `127.0.0.1` points to the Windows loopback, not WSL2.
- **Spotify redirect URI** must use `http://127.0.0.1:3000/callback` — Spotify banned `http://localhost` on April 9, 2025 (RFC 8252). Register exactly this in the Spotify Developer Dashboard.
- **CORS**: The backend must allow both `http://localhost:3000` and `http://127.0.0.1:3000` as origins, because the browser origin switches from `localhost` (initial load) to `127.0.0.1` (after Spotify redirect).
- If `127.0.0.1:3000` is unreachable from the Windows browser, enable WSL2 mirrored networking: add `networkingMode=mirrored` under `[wsl2]` in `~/.wslconfig` (requires Windows 11 22H2+), then `wsl --shutdown` and restart.

---

## OAuth Flow — Non-obvious Architecture Detail

The callback is handled differently from the standard OAuth pattern. Most implementations have Spotify redirect directly to the backend, which exchanges the code and then redirects the browser to the frontend. This app does it differently:

1. Backend `/login` **returns the Spotify auth URL as a string** (not a redirect)
2. Frontend stores it in state and uses it as `href` on the Log-In button
3. Spotify redirects the browser to `http://127.0.0.1:3000/callback?code=...&state=...` (the **frontend**)
4. Frontend reads `code` and `state` from the URL, then calls backend `GET /callback?code=...&state=...` via Axios
5. Backend validates state, exchanges the code, returns the Spotify user profile as JSON

This means the browser is briefly at `http://127.0.0.1:3000/callback` with query params visible, and the frontend has to parse them. The `utils.URLToken()` function does this parsing and assumes the URL format is exactly `?code=CODE&state=STATE` (code first, state second).

**The in-memory state store is wiped on backend restart.** `pendingStates` lives in the Node.js process. If nodemon or the server restarts between `/login` and `/callback`, the state won't be found and the callback will return `{ error: 'state_mismatch' }`. Just reload the page and start the login flow again.

---

## Known Limitations

- **No token refresh.** Access tokens expire after 1 hour. The user must log out and log in again.
- **`LandingPage.js`** is a placeholder component with no content.
- **`authString.js`** in `src/api/auth/tokens/` is a duplicate of `userLogin.js` and is unused.
- **`webpack.config.js`** in the frontend root is unused (CRA manages its own webpack config).
- **Background images** in `utils.changeImages()` are hotlinked from external CDNs — they may stop working if those hosts remove the images.
- **Frontend audit warnings**: The remaining vulnerabilities after `npm audit fix` are all inside CRA's internal build toolchain (`react-scripts`, `webpack-dev-server`, `jest`). They do not affect the production bundle. Resolving them would require ejecting from CRA.
- **No tests.** `src/test/App.test.js` exists but is empty.
- **`window.location.search = ""`** in `redeemToken.js` triggers a full page reload on successful login, which resets all React state. The user data returned from `/callback` is dispatched to state just before this, but everything else resets. This should be replaced with `window.history.replaceState({}, document.title, window.location.pathname)`.
- **Blueprint.js v4 + React 18** have a peer dependency conflict (`react-popper` requires React ≤17). CRA requires `--legacy-peer-deps` to install. This conflict goes away with Vite.
- **`getUser()` runs on every render** while on the `/callback` route (it's in the render body, not a `useEffect`). It's guarded by `!state.error` so it stops after first failure, but it's fragile and could fire multiple times before state updates.