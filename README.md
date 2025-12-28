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