# Chatter
Real‑time chat application built with React 19, Vite 7, Tailwind CSS 4, React Router 7, and Socket.IO Client. The app supports authenticated routes, conversations, group chats, friends, and an account view, with a simple dark mode toggle.

## Features

- Real‑time messaging: powered by `socket.io-client` with session resume via `localStorage`.
- Auth‑guarded routes: `PrivateRoutes` redirects unauthenticated users to login.
- Organized views: Conversations, Groups, Friends, and Account sections.
- Dark mode: toggles Tailwind’s class-based `dark` mode at the document root.
- Modern build: Vite dev server, fast HMR, production builds, and SPA rewrites.

## Tech Stack

- React 19 (`react`, `react-dom`)
- Vite 7 (`vite`, `@vitejs/plugin-react`)
- Tailwind CSS 4 with Vite plugin (`@tailwindcss/vite`, `tailwindcss`, `postcss`, `autoprefixer`)
- React Router 7 (`react-router-dom`)
- Socket.IO Client (`socket.io-client`)
- Utilities: `date-fns`, `emoji-picker-react`
- Linting: ESLint 9

## Project Structure

```
chatter-app/
├─ public/
├─ src/
│  ├─ components/               # UI components (Chat, ChatBox, Sidebar, etc.)
│  ├─ App.jsx                   # Shell layout with dark-mode toggle + Outlet
│  ├─ AppContext.jsx            # App context
│  ├─ AppProvider.jsx           # Context provider and router setup
│  ├─ PrivateRoutes.jsx         # Route guard using context `loggedIn`
│  ├─ routes.jsx                # Route definitions
│  ├─ socket.js                 # Socket.IO client and session handling
│  ├─ main.jsx                  # App bootstrap
│  ├─ index.css / App.css       # Styles (Tailwind entry, globals)
│  └─ ...
├─ index.html                   # SPA entry
├─ vite.config.js               # Vite config (React + Tailwind plugins)
├─ tailwind.config.js           # Tailwind config (class-based dark mode)
├─ vercel.json                  # SPA rewrites for Vercel
├─ eslint.config.js             # ESLint config
├─ package.json                 # Scripts and dependencies
└─ README.md
```

## Prerequisites

- Node.js ≥ 18 (Node 20 LTS recommended)
- npm ≥ 9

## Getting Started

1) Install dependencies:

```bash
npm install
```

2) Start the dev server:

```bash
npm run dev
```

Vite will print the local URL (defaults to http://localhost:5173). Open it in your browser.

## Available Scripts

- `npm run dev`: Start the Vite development server with HMR.
- `npm run build`: Create a production build in `dist/`.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint across the project.

## Configuration

### Socket backend URL

The Socket.IO client currently points to a hosted backend:

```js
// src/socket.js
const URL = "https://chatter-backend-production-1d5f.up.railway.app/";
```

To use a different backend, update `URL` in `src/socket.js`. The client is initialized with `autoConnect: false` and will auto-connect if a `sessionID` is present in `localStorage` (set after login). Otherwise, your login flow should call `socket.connect()` when appropriate.

### Routing

Routes are defined in `src/routes.jsx` and rendered through `AppProvider`. Private routes are enforced by `src/PrivateRoutes.jsx`, which checks `loggedIn` from `AppContext` and redirects to `/login` when not authenticated.

### Styling and Dark Mode

- Tailwind CSS 4 is configured via the Vite plugin (`@tailwindcss/vite`).
- Dark mode uses the `class` strategy; `App.jsx` toggles `document.documentElement.classList` with `dark`.
- Ensure Tailwind directives are present in `src/index.css` (e.g., `@import`/`@tailwind` as configured by Tailwind v4).

## Deployment

### Vercel

The project includes a `vercel.json` rewrite configuration for single-page app routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Typical steps:

1) Push the repo to GitHub.
2) Import the project in Vercel.
3) Framework preset: Vite (or “Other” → static). Build command: `npm run build`. Output directory: `dist`.
4) Deploy. Client-side routing will be handled by the rewrite above.

## Notes

- React Router v7 is used; routes (login, signup) are public while the main shell (`/`) is guarded.
- The app logs all socket events to the console by default for debugging (`socket.onAny`). Consider adjusting for production.
- ESLint is configured; run `npm run lint` to check code quality.