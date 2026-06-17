---
name: tsernc-monorepo-architecture
description: "Full-stack monorepo skill for React, Node.js/Express, and Next.js development using Turborepo + Yarn 4. Use when building API backends, React/Vite frontends, Next.js SSR apps, shared packages, Prisma DB layer, Docker environments. NOT for simple HTML/CSS/JS static sites or vanilla JS projects."
---

# TserNC Monorepo Architecture

Full-stack monorepo skill for **React**, **Node.js/Express**, and **Next.js** projects using Turborepo, Yarn 4 workspaces, Prisma, Docker, and TypeScript.

## When to Use

Use this skill when developing or scaffolding code in the TserNC monorepo for:

- **React (Vite)** frontend applications
- **Node.js / Express** API backends
- **Next.js** applications (SSR/SSG variant)
- Shared **TypeScript packages** (`@repo/db`, `@repo/ui`, `@repo/env`, etc.)
- **Prisma ORM** database layer
- **Docker** development or production environments
- Adding new apps or packages to the monorepo

**Do NOT use** for:

- Simple HTML/CSS/JS static websites
- Vanilla JavaScript projects without a framework
- Projects outside the TserNC monorepo structure

## Procedure

### 1. Start Development Environment

```bash
# Start all services (Postgres + API + Web)
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose -f docker-compose.dev.yml logs -f
```

See [docker-setup.md](./references/docker-setup.md) for detailed Docker commands.

### 2. Work on the API Backend

API is at `apps/api/` — Express + TypeScript + Prisma + Zod.

```
Route → Validation (Zod) → Controller → Service → Repository → Prisma → PostgreSQL
```

- **Routes** define endpoints → `apps/api/src/routes/`
- **Validation** uses Zod schemas → `apps/api/src/validation/`
- **Controllers** handle requests → `apps/api/src/controller/`
- **Services** contain business logic → `apps/api/src/service/`
- **Repositories** access data → `apps/api/src/repository/`

See [api-backend.md](./references/api-backend.md) for full API conventions.

### 3. Work on the Web Frontend

Frontend is at `apps/web/` — React 19 + Vite + Tailwind CSS 4 + Redux Toolkit.

- **Pages** → `apps/web/src/pages/`
- **Components** → `apps/web/src/components/`
- **Redux/RTK Query** → `apps/web/src/redux/`
- **Routing** → `apps/web/src/app/router.tsx`

See [web-frontend.md](./references/web-frontend.md) for full frontend conventions.

### 4. Use or Modify Shared Packages

Shared packages live in `packages/*` and are consumed by apps:

| Package                      | Import as                 | Purpose                    |
| ---------------------------- | ------------------------- | -------------------------- |
| `packages/db`                | `@repo/db`                | Prisma client & migrations |
| `packages/ui`                | `@repo/ui`                | Shared React components    |
| `packages/env`               | `@repo/env`               | Env var validation         |
| `packages/typescript-config` | `@repo/typescript-config` | Shared tsconfig bases      |
| `packages/eslint-config`     | `@repo/eslint-config`     | Shared ESLint config       |
| `packages/prettier-config`   | `@repo/prettier-config`   | Shared Prettier config     |

See [shared-packages.md](./references/shared-packages.md) for full details.

### 5. Manage Database

Database uses Prisma ORM with PostgreSQL:

```bash
# Generate Prisma client after schema changes
yarn db:generate

# Create a new migration
yarn db:migrate

# Seed the database
yarn db:seed
```

See [database.md](./references/database.md) for schema patterns and migration workflow.

### 6. Add a New App or Package

```bash
# Create app directory
mkdir -p apps/my-app/src

# Create package.json with workspace name
# Create tsconfig extending @repo/typescript-config/*
# Create turbo.json extending root
# Install deps with yarn workspace
```

See [scaffolding.md](./references/scaffolding.md) for full template and checklist.

### 7. Run Tests

Tests are co-located in `__tests__/` directories using Vitest, with E2E tests in `tests/` using Playwright.

See [testing.md](./references/testing.md) for test configuration and best practices.
