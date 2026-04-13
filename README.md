# playlist_me

A personal Spotify playlist browser. Browse my playlists by genre, preview tracks, and save songs you like.

![playlist_me screenshot placeholder](https://via.placeholder.com/900x500/1a1a2e/ffffff?text=playlist_me)

## Features

- Browse playlists filtered by genre or searched by name
- 30-second audio previews inline — no Spotify app required
- Song detail panel with album art and metadata
- Follow a playlist or add a track to your Liked Songs
- Automatic token refresh — stay logged in without re-authenticating
- Works in WSL2 (handles the `localhost` vs `127.0.0.1` split)

## Stack

| Layer | Tech |
|---|---|
| Frontend | Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui · React Query |
| Backend | Node.js · Express · TypeScript |
| Auth | Spotify OAuth 2.0 (Authorization Code flow) |

## Prerequisites

- Node.js 18+
- A [Spotify Developer app](https://developer.spotify.com/dashboard)
  - Add `http://127.0.0.1:3000/callback` as a Redirect URI
  - Note your **Client ID**, **Client Secret**, and **User ID**

> **Note for WSL2 users:** Use `127.0.0.1` (not `localhost`) for the Redirect URI. Spotify banned `localhost` redirects in April 2025. See CLAUDE.md for full WSL2 networking notes.

## Setup

**1. Backend**

```bash
cd backend
cp .env.example .env
# Fill in SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_USER_ID
npm install
npm run dev        # http://localhost:3001
```

**2. Frontend**

```bash
cd frontend
cp .env.example .env
# VITE_BASE_URL=http://localhost:3001  (already set in .env.example)
npm install
npm run dev        # http://localhost:3000
```

Open `http://localhost:3000`. The genre dropdown and playlist grid appear immediately; click **Log in with Spotify** to enable follow and like actions.

## Environment variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `PORT` | Server port (default `3001`) |
| `SPOTIFY_CLIENT_ID` | From Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | Never sent to the browser |
| `SPOTIFY_REDIRECT_URI` | Must be `http://127.0.0.1:3000/callback` |
| `SPOTIFY_USER_ID` | Your Spotify username |
| `FRONTEND_URL` | CORS origin (default `http://localhost:3000`) |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_BASE_URL` | Backend base URL (default `http://localhost:3001`) |

## Project structure

```
playlist_me/
├── frontend/          Vite + React frontend
│   └── src/
│       ├── api/       Axios wrappers for every backend endpoint
│       ├── components/  UI broken into landing/, browse/, tracklist/, song/
│       ├── context/   AuthContext — auth state via useReducer
│       └── hooks/     React Query hooks + useAudioPreview
└── backend/           Express API — all Spotify calls proxied here
    └── src/
        ├── routes/    One file per endpoint group
        └── services/  spotifyAuth, spotifyApi, stateStore, tokenStore
```

For architecture decisions, OAuth flow details, and WSL2 networking notes, see [CLAUDE.md](./CLAUDE.md).
