# TaskFlow

A full-stack task manager where you can register, log in, and manage tasks across
three columns: Todo, In Progress, and Done. Built with a typed, layered
architecture so the codebase stays clean as features grow.

**Live demo:** https://task-manager-weld-six-44.vercel.app
**API:** https://taskflow-api-614c.onrender.com/health

> Test login — email: `neon@test.com`, password: `Passw0rd123`
> The API is on a free tier, so the first request after it's been idle can take ~30-50s to wake.

## Tech Stack

- **Frontend:** React + Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, Zustand, React Hook Form + Zod, Framer Motion, Axios
- **Backend:** Node.js, Express, TypeScript, PostgreSQL (Neon) with Prisma, Redis (ioredis), JWT, bcrypt, Zod
- **Hosting:** Vercel (frontend), Render (backend), Neon (database), Render Key Value (Redis)

## Features

- JWT authentication: register, login, logout, persistent sessions, protected routes
- Task CRUD across Todo / In Progress / Done, with move-between-columns
- Light/dark theme, responsive layout, toast notifications, skeleton loaders
- Form validation shared in spirit between client and server (same Zod rules)

## What I think makes this project a bit different

1. **Layered backend with framework-free services.** Requests flow through
   `route -> middleware -> controller -> service -> repository`. Controllers only
   translate HTTP, and services never touch `req`/`res`, so the business logic is
   easy to read and test in isolation. Prisma access is isolated in the repository
   layer, which means swapping or tuning queries doesn't leak into the rest of the app.

2. **Redis does three jobs, and all of them fail open.** I use Redis for a
   read-through cache (user profile and task lists), distributed rate limiting on
   auth routes, and JWT revocation (logout adds the token's `jti` to a denylist
   that self-expires when the token would). Every cache call is wrapped so that if
   Redis is down, the app falls back to the database instead of erroring out.

3. **Optimistic UI with rollback.** Creating, editing, moving, and deleting tasks
   update the board instantly via TanStack Query's optimistic updates, then roll
   back automatically if the server rejects the change. The board feels instant
   even on a cold backend.

## How the code is optimized

- **Indexing:** `email` is uniquely indexed, and tasks have a composite index on
  `(user_id, status)` because the board always queries "my tasks in this column."
- **Selective queries:** the repositories `select` only the columns each call needs
  (e.g. an existence check fetches just `id`), and the password hash is never
  selected unless verifying credentials.
- **Connection pooling:** a single Prisma client is cached on `globalThis` so dev
  hot-reloads don't open new pools and exhaust Postgres connections.
- **Caching:** the most-read endpoints (`/auth/me`, task list) are served from
  Redis and invalidated on every write, so reads don't hit Postgres every time.
- **Frontend bundle:** routes are code-split with `React.lazy`, so the initial load
  only ships what's needed for the current page.

## Tradeoffs I made (and why)

- **Bearer token in client storage, not httpOnly cookies.** The frontend (Vercel)
  and backend (Render) are on different domains. A bearer token in storage avoids
  the cross-site cookie friction (SameSite=None, CSRF handling) for this scope. The
  service and interceptor boundaries are set up so moving to refresh cookies later
  is a localized change.
- **Neon direct (non-pooled) connection.** Render runs a single persistent server,
  not serverless functions, so I don't need PgBouncer pooling. The direct URL also
  works for Prisma migrations without extra config, which keeps deploys simple.
- **Move tasks via a menu, not drag-and-drop.** A menu action ("Move to...") is
  fully keyboard-accessible and reliable with far less code than a DnD library.
  Drag-and-drop is a natural next step if needed.
- **Free hosting tiers.** Great for a demo, but the backend sleeps when idle, so the
  first request is slow. A paid tier removes the cold start.

## Running locally

You need Node 18+, a Postgres database (Neon or local), and Redis.

```bash
# 1. Infra (optional, if you want local Postgres + Redis)
docker compose up -d

# 2. Backend
cd backend
.env        # set DATABASE_URL, REDIS_URL, JWT_ACCESS_SECRET
npm install
npm run prisma:migrate      # create the tables
npm run dev                 # http://localhost:5000

# 3. Frontend
cd frontend
.env        # VITE_API_URL=http://localhost:5000/api/v1
npm install
npm run dev                 # http://localhost:5173
```

Generate a JWT secret with:
`node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## API

Base URL: `/api/v1`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | - | Create account, returns user + token |
| POST | `/auth/login` | - | Authenticate, returns user + token |
| GET | `/auth/me` | Bearer | Current user (cached) |
| POST | `/auth/logout` | - | Revoke the current token |
| GET | `/tasks` | Bearer | List my tasks |
| POST | `/tasks` | Bearer | Create a task |
| PATCH | `/tasks/:id` | Bearer | Update a task |
| DELETE | `/tasks/:id` | Bearer | Delete a task |

Every response uses the same envelope: `{ success, message, data }` on success and
`{ success, message, errors }` on failure.

## Project structure

```
backend/
  prisma/            # schema + migrations
  src/
    config/          # env validation, Prisma client, Redis client
    controllers/     # HTTP layer (thin)
    middleware/      # auth, validation, rate limiting, error handling
    repositories/    # Prisma data access
    services/        # business logic
    routes/ utils/ validations/ lib/
frontend/
  src/
    components/      # ui/, feedback/, layout/, tasks/
    hooks/ store/    # React Query hooks, Zustand stores
    layouts/ pages/ routes/
    services/        # axios client + API services
    types/ lib/ animations/
```
