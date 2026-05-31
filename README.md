# TaskFlow — Full-Stack Task Manager

A production-grade task manager built with a modern, scalable architecture. This
repository contains **Phase 1**: full project architecture, a complete and secure
authentication system, a reusable UI design system, layouts, the API layer, and
state management. Task CRUD lands in Phase 2 — the codebase is structured so it
plugs in without rework.

> Design language inspired by Linear, Notion, Trello, and the Vercel dashboard:
> neutral dark/light theme, smooth motion, clean typography.

---

## ✨ Features (Phase 1)

- 🔐 **Authentication** — register, login, logout, JWT, bcrypt hashing, protected routes, persistent sessions
- 🧱 **Scalable architecture** — clean separation of concerns on both ends (`routes → middleware → controller → service → repository`)
- 🐘 **PostgreSQL + Prisma** — typed schema, migrations, connection-pooled client singleton, indexed lookups, selective field queries
- ⚡ **Redis** — read-through cache for profiles, distributed rate-limiting, and JWT revocation (logout denylist) — all with graceful fail-open fallback
- 🎨 **Design system** — themeable (dark/light) reusable UI: Button, Input, Modal, Card, Loader, Skeleton, Empty/Error states
- 🧭 **App shell** — collapsible desktop sidebar, sticky navbar, mobile slide-over nav
- 🔄 **API layer** — Axios instance with auth + error interceptors and a normalized error contract
- 🗂️ **State** — Zustand for auth/session/UI, TanStack Query for server state
- 🔔 **UX polish** — toast notifications, skeleton loaders, optimistic logout, route-level code splitting, page transitions

---

## 🧰 Tech Stack

| Layer     | Technologies |
|-----------|--------------|
| Frontend  | React + Vite, TypeScript, Tailwind CSS, React Router, Axios, React Hook Form, Zod, TanStack Query, Framer Motion, Zustand |
| Backend   | Node.js, Express, PostgreSQL + Prisma, Redis (ioredis), JWT, bcrypt, Zod, Helmet, distributed rate limiting |
| Infra     | Docker Compose (Postgres + Redis) for local dev |
| Tooling   | ESLint, TypeScript (strict), tsx |

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   ├── prisma/
│   │   └── schema.prisma   # PostgreSQL schema (User + indexes) and migrations
│   ├── src/
│   │   ├── config/        # env validation, Prisma client, Redis client
│   │   ├── controllers/   # HTTP layer (thin)
│   │   ├── lib/            # cache helpers + key builders (Redis)
│   │   ├── middleware/     # auth guard, validation, rate limiting, error handling
│   │   ├── repositories/   # Prisma data-access layer (persistence-isolated)
│   │   ├── routes/         # route tables (versioned under /api/v1)
│   │   ├── services/       # business logic (auth, token revocation)
│   │   ├── utils/          # ApiError, asyncHandler, token, response helpers
│   │   ├── validations/    # Zod request schemas
│   │   ├── app.ts          # Express app assembly
│   │   └── server.ts       # bootstrap + graceful shutdown
│   └── .env.example
│
└── frontend/
    └── src/
        ├── animations/     # Framer Motion variants
        ├── components/     # ui/, feedback/, layout/
        ├── hooks/          # useSession, useAuthMutations, useTheme
        ├── layouts/        # AuthLayout, DashboardLayout
        ├── lib/            # cn, env, queryClient, validations
        ├── pages/          # Login, Register, Dashboard, NotFound
        ├── routes/         # AppRouter, Protected/Public route guards
        ├── services/       # apiClient (axios) + feature API services
        ├── store/          # Zustand stores (auth, ui)
        ├── types/          # shared TypeScript types
        ├── App.tsx
        └── main.tsx
```

### Separation of concerns

- **Backend:** `routes → middleware (validate/auth) → controller → service → model`.
  Controllers never hold business logic; services never touch `req`/`res`.
- **Frontend:** components stay declarative. Side effects (API, store, toasts,
  navigation) live in hooks and the service layer.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL + Redis. The fastest path is Docker (below); alternatively use managed
  services (e.g. [Neon](https://neon.tech)/[Supabase](https://supabase.com) for Postgres,
  [Upstash](https://upstash.com) for Redis).

### 0. Start infrastructure (Docker)

```bash
docker compose up -d        # starts Postgres (:5432) and Redis (:6379)
```

### 1. Backend

```bash
cd backend
cp .env.example .env        # then fill in the values (Windows: copy .env.example .env)
npm install                 # also runs `prisma generate`
npm run prisma:migrate      # create & apply the initial migration
npm run dev                 # http://localhost:5000  (health: /health)
```

Required env (`backend/.env`):

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default 5000) |
| `CLIENT_ORIGIN` | Allowed CORS origin(s), comma-separated |
| `DATABASE_URL` | PostgreSQL connection string (`?connection_limit=` tunes the pool) |
| `REDIS_URL` | Redis connection string |
| `USER_CACHE_TTL` | Profile cache TTL in seconds (default 300) |
| `JWT_ACCESS_SECRET` | Long random secret (≥16 chars) |
| `JWT_ACCESS_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `BCRYPT_SALT_ROUNDS` | Hashing cost (default 12) |

### 2. Frontend

```bash
cd frontend
cp .env.example .env        # set VITE_API_URL
npm install
npm run dev                 # http://localhost:5173
```

Required env (`frontend/.env`): `VITE_API_URL=http://localhost:5000/api/v1`

---

## 📜 Scripts

**Backend**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload (tsx) |
| `npm run build` | `prisma generate` + compile TypeScript to `dist/` |
| `npm start` | Run the compiled server |
| `npm run prisma:migrate` | Create & apply a dev migration |
| `npm run prisma:deploy` | Apply migrations in production/CI |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run typecheck` | Type-check without emitting |
| `npm run lint` | Lint source |

**Frontend**

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint source |

---

## 🔌 API Reference (Phase 1)

Base URL: `/api/v1`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/auth/register` | – | `{ name, email, password }` | Create account, returns `{ user, token }` |
| `POST` | `/auth/login` | – | `{ email, password }` | Authenticate, returns `{ user, token }` |
| `GET`  | `/auth/me` | Bearer | – | Current user profile |
| `POST` | `/auth/logout` | – | – | Stateless logout acknowledgement |

All responses use a consistent envelope:

```jsonc
// success
{ "success": true, "message": "…", "data": { … } }
// error
{ "success": false, "message": "…", "errors": { "email": "…" } }
```

---

## ☁️ Deployment

### Backend → Render
- The included [`render.yaml`](render.yaml) provisions the web service and a
  **Redis (Key Value)** instance (auto-wiring `REDIS_URL`), and generates
  `JWT_ACCESS_SECRET`.
- **Database:** managed by **[Neon](https://neon.tech)**. Create a project, copy the
  **direct** (non-pooled) connection string (`...neon.tech/neondb?sslmode=require`),
  and paste it into Render as the `DATABASE_URL` env var.
- **Root directory:** `backend`
- **Build command:** `npm install && npm run build && npm run prisma:deploy` (applies migrations to Neon)
- **Start command:** `npm start`
- Also set `CLIENT_ORIGIN` to your deployed frontend URL.

### Frontend → Vercel
- **Root directory:** `frontend`
- Framework preset: **Vite** (a `vercel.json` with SPA rewrites is included).
- Add env var `VITE_API_URL` = your Render API URL + `/api/v1`.

---

## ⚡ Performance & Database Optimization

- **Indexed lookups:** `email` carries a unique B-tree index, so login and
  uniqueness checks are index scans rather than sequential scans.
- **Selective queries:** the repository selects only required columns (e.g. an
  existence check fetches just `id`), reducing row width and never loading the
  password hash into memory unless verifying credentials.
- **Connection pooling:** a single Prisma client (cached across hot-reloads on
  `globalThis`) owns the pool; size is tunable via `?connection_limit=` on
  `DATABASE_URL`.
- **Read-through cache:** `/auth/me` serves from Redis first and backfills on a
  miss (TTL `USER_CACHE_TTL`), cutting DB load for the most-polled endpoint.
- **Distributed rate limiting:** auth-route limits live in Redis, so they hold
  across multiple API instances instead of resetting per process.
- **Graceful degradation:** every cache/denylist operation fails open — a Redis
  outage falls back to Postgres rather than taking the API down.

## 🔒 Security Notes

- Passwords hashed with bcrypt (cost-configurable); the hash column is never selected unless verifying credentials.
- JWTs carry a unique `jti`; **logout revokes the token** via a Redis denylist that self-expires with the token. 401s auto-clear the client session.
- Generic credential errors prevent user enumeration.
- Helmet security headers, CORS allowlist, request size limits, and distributed rate limiting on auth routes.
- All env vars validated at startup — the server refuses to boot if misconfigured.

> **Token storage:** Phase 1 uses a bearer access token persisted client-side for
> a frictionless cross-origin (Vercel ↔ Render) setup. For higher-security
> deployments, migrate to httpOnly refresh cookies — the service/interceptor
> boundaries are already in place to make that swap localized.

---

## 🗺️ Roadmap

- **Phase 2:** Task CRUD across Todo / In Progress / Done (drag & drop, optimistic updates).
  The dashboard board shells, `navItems`, and query client are already in place.
- **Phase 3:** Filtering, search, due dates, labels, and collaboration.
