# Project Skill — TserNC Monorepo Architecture

> **Purpose:** This document defines the canonical project structure, conventions, and tooling for the TserNC monorepo.  
> Use this as a reference when scaffolding new projects, adding features, or understanding the architecture.

---

## Table of Contents

1. [Monorepo Overview](#1-monorepo-overview)
2. [Root-Level Layout](#2-root-level-layout)
3. [API Backend (`apps/api`)](#3-api-backend-appsapi)
4. [Web Frontend (`apps/web`)](#4-web-frontend-appsweb)
5. [Next.js Frontend (`apps/web` — optional variant)](#5-nextjs-frontend-appsweb--optional-variant)
6. [Shared Packages (`packages/*`)](#6-shared-packages-packages)
7. [Database Layer (`@repo/db`)](#7-database-layer-repodb)
8. [Docker & CI/CD](#8-docker--cicd)
9. [Testing Strategy](#9-testing-strategy)
10. [Scaffolding a New Project](#10-scaffolding-a-new-project)

---

## 1. Monorepo Overview

This project uses **Turborepo** with **Yarn 4** (Berry) workspaces to manage multiple applications and shared packages in a single repository.

| Tool | Version / Config |
|---|---|
| **Package manager** | Yarn 4.11.0 (`corepack enable`) |
| **Monorepo orchestrator** | Turborepo 2.x |
| **Node.js** | 22 (Alpine in Docker) |
| **TypeScript** | ^5.9 |

### Key Principles

- **`apps/*`** — Deployable applications (API, Web, etc.)
- **`packages/*`** — Shared libraries consumed by apps
- **`turbo.json`** at root defines task pipelines (`build`, `dev`, `start`, `lint`)
- All apps and packages use `tsconfig` that extends `@repo/typescript-config/*`
- ESLint + Prettier run across the entire monorepo
- Husky + lint-staged enforce code quality on commit

### Root `turbo.json` Task Configuration

```jsonc
{
  "tasks": {
    "dev": {
      "cache": false,       // Don't cache dev mode (always run fresh)
      "persistent": true    // Keep running (watch mode / servers)
    },
    "build": {
      "dependsOn": ["^build"], // Build deps first (shared packages before apps)
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**"]
    },
    "start": {
      "dependsOn": ["build"],
      "persistent": true,
      "cache": false
    },
    "lint": {
      "outputs": []
    }
  }
}
```

---

## 2. Root-Level Layout

```
tsernc/
├── apps/                    # Deployable applications
│   ├── api/                 # Express backend
│   └── web/                 # React / Vite frontend (or Next.js variant)
├── packages/                # Shared libraries
│   ├── db/                  # Prisma ORM + database client
│   ├── env/                 # Environment variable schemas
│   ├── eslint-config/       # Shared ESLint configuration
│   ├── prettier-config/     # Shared Prettier configuration
│   ├── typescript-config/   # Shared TypeScript configurations
│   └── ui/                  # Shared UI components (React)
├── docker/                  # Dockerfiles for each app
├── nginx/                   # Nginx config (production reverse proxy)
├── tests/                   # Cross-app / E2E / integration tests
│
├── package.json             # Root workspace config
├── turbo.json               # Turborepo task pipeline
├── docker-compose.dev.yml   # Development environment (Postgres + API + Web)
├── docker-compose.prod.yml  # Production environment (Nginx + API + DB)
├── yarn.lock
├── .yarnrc.yml
├── .eslintrc.js
├── .prettierrc
├── .husky/                  # Git hooks
└── PROJECT_SKILL.MD         # This file
```

### Root `package.json` Scripts

```jsonc
{
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "start": "turbo run start",
    "lint:check": "turbo run lint",
    "lint:fix": "turbo run lint -- --fix",
    "format:check": "prettier --check \"**/*.{ts,tsx,md}\"",
    "format:fix": "prettier --write \"**/*.{ts,tsx,md}\"",
    "db:generate": "docker compose -f docker-compose.dev.yml exec api yarn workspace @repo/db db-generate",
    "db:migrate": "docker compose -f docker-compose.dev.yml exec api yarn workspace @repo/db db-migrate",
    "db:seed": "docker compose -f docker-compose.dev.yml exec api yarn workspace @repo/db db-seed",
    "docker:dev:up": "docker compose -f docker-compose.dev.yml up -d",
    "docker:dev:down": "docker compose -f docker-compose.dev.yml down",
    "docker:dev:logs": "docker compose -f docker-compose.dev.yml logs -f",
    "docker:dev:rebuild": "docker compose -f docker-compose.dev.yml build --no-cache",
    "docker:dev:restart": "docker compose -f docker-compose.dev.yml restart"
  }
}
```

---

## 3. API Backend (`apps/api`)

**Stack:** Express 4.x + TypeScript + Prisma ORM + Zod validation + Winston logging + JWT auth + Swagger

```
apps/api/
├── nodemon.json             # Nodemon config (hot-reload via tsx)
├── package.json
├── tsconfig.json            # Extends @repo/typescript-config/base.json
├── turbo.json
├── logs/                    # Log output directory (gitignored)
└── src/
    ├── index.ts             # Entry point — starts Express server
    ├── app.ts               # Express app setup (middleware, routes, error handling)
    │
    ├── config/              # Configuration files
    │   ├── logger.config.ts # Winston logger setup
    │   └── swagger.config.ts# Swagger/OpenAPI configuration
    │
    ├── controller/          # Request handlers (thin layer)
    │   ├── index.ts         # Re-export all controllers
    │   └── authController.ts
    │
    ├── service/             # Business logic layer
    │   ├── index.ts         # Re-export all services
    │   └── authService.ts
    │
    ├── repository/          # Data access layer (Prisma)
    │   ├── baseRepository.ts    # Generic CRUD base class
    │   ├── repositoryWrapper.ts # Singleton wrapper exposing all repositories
    │   └── userRepository.ts
    │
    ├── middleware/           # Express middleware
    │   ├── authMiddleware.ts # JWT authentication
    │   ├── corsMiddleware.ts # CORS configuration
    │   ├── errorMiddleware.ts# Global error handler
    │   └── loggerMiddleware.ts# Request/response logging
    │
    ├── model/               # TypeScript type definitions / DTOs
    │   └── userModel.ts
    │
    ├── routes/              # Route definitions
    │   ├── index.ts         # Route aggregator
    │   └── authRoute.ts
    │
    ├── validation/          # Zod schemas for request validation
    │   ├── index.ts         # Re-export all schemas
    │   └── authValidation.ts
    │
    ├── types/               # TypeScript ambient type declarations
    │   └── express.d.ts     # Extends Express.Request with custom fields
    │
    ├── utils/               # Utility classes & helpers
    │   ├── apiError.ts      # Custom error class
    │   ├── apiResponse.ts   # Standardized API response wrapper
    │   └── asyncHandler.ts  # Async error wrapper for Express routes
    │
    └── lib/                 # Core library modules (DB client, JWT helpers)
        ├── db.ts            # Prisma client singleton
        └── jwt.ts           # JWT sign/verify helpers
```

### Architecture Layers (Data Flow)

```
Route → Validation (Zod) → Controller → Service → Repository → Prisma → PostgreSQL
                                                              ↕
                                                           Model (types)
```

- **Validation** — Zod schemas parse and validate incoming request data
- **Controller** — Thin handler; extracts params, calls service, sends response via `ApiResponse`
- **Service** — Business logic, orchestrates repositories, throws `apiError` on failures
- **Repository** — Data access via `BaseRepository<T>` generic CRUD; extend for custom queries
- **Middleware** — Auth, CORS, logging, error handling (global error handler catches `apiError`, `ZodError`, and generic errors)

### API Response Envelope

All responses use `ApiResponse` class:

```typescript
class ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;  // true if statusCode < 400
}
```

### Error Handling

Custom `apiError` class with `statusCode` and optional `errors` payload.  
Global `errorHandler` middleware catches:
- `apiError` — custom application errors
- `ZodError` — validation failures (returns 400)
- Generic `Error` — unexpected errors (returns 500)

### Nodemon Dev Server

```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "exec": "npx tsx src/index.ts"
}
```

---

## 4. Web Frontend (`apps/web`)

**Stack:** React 19 + Vite 5 + TypeScript + Tailwind CSS 4 + Redux Toolkit / RTK Query + React Router 7 + Framer Motion

```
apps/web/
├── index.html               # Vite HTML entry point
├── package.json
├── tsconfig.json            # Extends @repo/typescript-config/vite.json
├── turbo.json
├── vite.config.ts           # Vite config (React + Tailwind plugins, HMR polling)
├── public/                  # Static assets
└── src/
    ├── main.tsx             # React entry point (creates root, renders <Providers />)
    ├── vite-env.d.ts        # Vite type declarations
    │
    ├── app/                 # App-level configuration & layout
    │   ├── Layout.tsx       # Root layout (Header + Outlet)
    │   ├── providers.tsx    # Redux Provider + RouterProvider
    │   ├── router.tsx       # React Router configuration
    │   └── protectedRoute.tsx # Auth guard (redirects to / if not authenticated)
    │
    ├── pages/               # Route-level page components
    │   ├── index.ts         # Re-export all pages
    │   ├── Home/
    │   │   └── Home.tsx
    │   └── Unauthorised/
    │       └── Unauthorised.tsx
    │
    ├── components/          # Reusable UI components
    │   ├── index.ts         # Re-export all components
    │   ├── layout/          # Layout-specific components
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   └── Feature/         # Feature-specific components
    │       └── SignInUpModal.tsx
    │
    ├── redux/               # State management
    │   ├── store.ts         # Redux store configuration
    │   └── api/             # RTK Query API slices
    │       ├── baseApi.ts   # Base API config (fetchBaseQuery with auth headers)
    │       └── authApi.ts   # Auth endpoints (injected via injectEndpoints)
    │
    ├── hooks/               # Custom React hooks
    │   └── index.ts
    │
    ├── context/             # React Context providers
    │   └── ...              # (empty, available for shared context)
    │
    ├── helper/              # Helper/utility functions
    │   └── authHelpers.ts   # Auth storage helpers (save/clear/check token)
    │
    ├── config/              # App configuration
    │   └── config.ts        # Reads env vars via import.meta.env
    │
    ├── utils/               # General utilities
    │   ├── index.ts
    │   └── errorHandler.ts
    │
    └── styles/              # Global CSS (Tailwind)
        ├── globals.css      # Tailwind directives (@tailwind base/components/utilities)
        ├── components.css   # Component-level custom styles
        └── utilities.css    # Custom utility classes
```

### State Management Pattern

- **Redux Toolkit** store configured in `store.ts`
- **RTK Query** (`baseApi.ts`) handles all API communication:
  - Base URL from `config.ts` (env var `VITE_API_ENDPOINT_URL`)
  - Auth token injected via `prepareHeaders`
  - Feature APIs extend via `injectEndpoints()`
- **Local state** in components; **auth state** persisted in `localStorage`

### Routing Pattern

Routes defined in `router.tsx` using `createBrowserRouter`:

```typescript
<Route path="/" element={<Layout />}>
  <Route path="" element={<Home />} />
  <Route path="dashboard" element={<ProtectedRoute />} />
</Route>
<Route path="*" element={<Unauthorised />} />
```

- `Layout` wraps all main routes with shared UI (Header, Footer, etc.)
- `ProtectedRoute` checks `isAuthenticated()` from auth helpers

### Styling

- **Tailwind CSS 4** via `@tailwindcss/vite` plugin
- CSS modules split into `globals.css`, `components.css`, `utilities.css`
- Dark mode support via Tailwind classes (e.g., `dark:bg-home-background-dark`)

---

## 5. Next.js Frontend (`apps/web` — Optional Variant)

If a project requires SSR, SSG, or better SEO, use **Next.js** instead of Vite+React.  
The structure below follows the same monorepo conventions:

```
apps/web/                          # ← Replace Vite scaffold with Next.js
├── package.json
├── tsconfig.json                  # Extends @repo/typescript-config/next.json
├── turbo.json
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS (Tailwind)
├── public/
│   └── assets/
└── src/
    ├── app/                       # App Router (Next.js 15)
    │   ├── layout.tsx             # Root layout (providers, metadata)
    │   ├── page.tsx               # Home page
    │   ├── loading.tsx            # Loading UI (Suspense boundary)
    │   ├── error.tsx              # Error boundary
    │   ├── not-found.tsx          # 404 page
    │   │
    │   ├── (auth)/                # Route group (auth pages)
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── register/
    │   │       └── page.tsx
    │   │
    │   ├── dashboard/             # Protected route group
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   │
    │   └── api/                   # API routes (if needed)
    │       └── [...route]/
    │           └── route.ts
    │
    ├── components/                # Reusable React components
    │   ├── ui/                    # Atomic UI components (Button, Input, Modal, etc.)
    │   └── layout/                # Layout components (Header, Footer, Sidebar)
    │
    ├── lib/                       # Core utilities & client instances
    │   ├── db.ts                  # Prisma client (if using server-side DB calls)
    │   ├── auth.ts                # NextAuth / Auth.js configuration
    │   └── utils.ts               # Utility functions (cn, etc.)
    │
    ├── hooks/                     # Custom React hooks
    │
    ├── store/                     # State management (Redux / Zustand)
    │   ├── store.ts
    │   └── api/                   # RTK Query (if using Redux)
    │
    ├── styles/                    # Global styles
    │   └── globals.css
    │
    └── types/                     # TypeScript type definitions
```

### Key Differences from Vite React

| Aspect | Vite React | Next.js |
|---|---|---|
| **Routing** | React Router (`router.tsx`) | File-based App Router |
| **Rendering** | Client-side (CSR) | SSR / SSG / ISR (per-page) |
| **API calls** | RTK Query (client-side) | Server Actions / Route Handlers |
| **Metadata** | `index.html` | `layout.tsx` exports |
| **Data fetching** | `useEffect` / RTK Query | `fetch` in Server Components |
| **TypeScript config** | `vite.json` | `next.json` (or custom) |

### Next.js Docker Support

Create `docker/Dockerfile.web.next.dev` and `docker/Dockerfile.web.next.prod` following same multi-stage pattern.

---

## 6. Shared Packages (`packages/*`)

```
packages/
├── db/                      # Prisma ORM (see §7)
├── env/                     # Environment variable validation (e.g., Zod schemas)
├── eslint-config/           # Shared ESLint flat config
│   ├── index.js
│   └── package.json
├── prettier-config/         # Shared Prettier config
│   ├── index.json
│   └── package.json
├── typescript-config/       # Shared tsconfig bases
│   ├── base.json            # For Node/API apps
│   ├── api.json             # API-specific overrides
│   ├── vite.json            # For Vite + React apps
│   ├── next.json            # For Next.js apps
│   ├── ui.json              # For UI package
│   └── db.json              # For DB package
└── ui/                      # Shared React UI components
    ├── components/          # Reusable components (Button, Input, Modal, etc.)
    ├── styles/              # Shared styles
    ├── utils/               # Shared utility functions
    ├── icons.ts             # Icon exports
    └── index.ts             # Barrel export
```

### Package Naming Convention

| Directory | Package Name |
|---|---|
| `packages/db` | `@repo/db` |
| `packages/env` | `@repo/env` |
| `packages/eslint-config` | `@repo/eslint-config` |
| `packages/prettier-config` | `@repo/prettier-config` |
| `packages/typescript-config` | `@repo/typescript-config` |
| `packages/ui` | `@repo/ui` |

### Exports Pattern (package.json)

```jsonc
{
  "exports": {
    "./client": "./src/index.ts",   // e.g., @repo/db/client
    "./utils": "./src/utils.ts"     // e.g., @repo/db/utils
  }
}
```

---

## 7. Database Layer (`@repo/db`)

**Stack:** Prisma ORM 7.x + PostgreSQL 17

```
packages/db/
├── package.json          # name: "@repo/db", private: true
├── prisma.config.ts      # Prisma config (schema path, datasource)
├── tsconfig.json         # Extends @repo/typescript-config/db.json
├── prisma/
│   └── schema.prisma     # Data model definitions
├── src/
│   ├── index.ts          # Exports PrismaClient singleton
│   └── seed.ts           # Database seed script
├── generated/            # Generated Prisma client (gitignored)
└── migrations/           # Migration files
```

### Scripts

```jsonc
{
  "scripts": {
    "db-generate": "prisma generate",
    "db-migrate": "prisma migrate dev",
    "db-seed": "tsx src/seed.ts",
    "db-reset": "prisma migrate reset"
  }
}
```

### Prisma Schema Example

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id       Int      @id @default(autoincrement())
  uniqueId String   @unique
  name     String   @db.VarChar(100)
  email    String   @unique @db.VarChar(320)
  password String   @db.VarChar(255)
}
```

### Prisma Client Singleton (`packages/db/src/index.ts`)

Exports a cached PrismaClient singleton to prevent connection exhaustion during hot-reloads.

---

## 8. Docker & CI/CD

### Development Environment

**File:** `docker-compose.dev.yml`

Three services:
| Service | Container | Image | Port | Purpose |
|---|---|---|---|---|
| `db` | `tsernc-postgres` | `postgres:17` | `5432` | PostgreSQL database |
| `api` | `tsernc-api` | custom (dev) | `3001` | Express API with nodemon hot-reload |
| `web` | `tsernc-web` | custom (dev) | `5173` | Vite dev server with HMR |

**Key features:**
- Bind-mounts entire monorepo for live code sync
- Anonymous volumes prevent host `node_modules` shadowing
- `CHOKIDAR_USEPOLLING=1` + `WATCHPACK_POLLING=true` for file watching in Docker
- Health check on `db` ensures API waits for PostgreSQL
- Shared network `app-network` for inter-service communication

**Usage:**
```bash
docker compose -f docker-compose.dev.yml up -d          # Start
docker compose -f docker-compose.dev.yml down           # Stop
docker compose -f docker-compose.dev.yml logs -f        # Tail logs
docker compose -f docker-compose.dev.yml build --no-cache  # Force rebuild
```

### Production Environment

**File:** `docker-compose.prod.yml`

Three services:
| Service | Image Source | Purpose |
|---|---|---|
| `db` | `postgres:17` | PostgreSQL database |
| `api` | Multistage `Dockerfile.api.prod` | Compiled Express app |
| `nginx` | Multistage `Dockerfile.web.prod` | Nginx serving built SPA + reverse proxy to API |

Nginx config (`nginx/nginx.prod.conf`):
- Serves the built web app (via `proxy_pass` to `web:5173`)
- Proxies `/api/*` to API server (strips `/api` prefix)
- Serves `/api-docs` (Swagger UI)

### Dockerfile Structure

**Development Dockerfiles** (`docker/Dockerfile.*.dev`):
- Single stage
- Install ALL dependencies (including devDependencies)
- Run via dev command (nodemon, vite dev server)
- Use polling for file watching

**Production Dockerfiles** (`docker/Dockerfile.*.prod`):
- **Multi-stage build:**
  1. `builder` stage — installs all deps, copies source, compiles/builds
  2. `production` stage — copies only built artifacts + production dependencies
- Clean separation of build-time and runtime dependencies

### Dockerfile Patterns

All Dockerfiles follow consistent patterns:
1. `FROM node:22-alpine`
2. Enable Corepack + prepare Yarn 4
3. Copy dependency manifests first (layer caching)
4. `yarn install --immutable && yarn cache clean`
5. Copy source code
6. Build/generate artifacts
7. Production stage copies only what's needed

### CI/CD Pipeline (Suggested)

```yaml
# .github/workflows/ci.yml (or equivalent)
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: corepack enable && corepack prepare yarn@4.11.0 --activate
      - run: yarn install --immutable
      - run: yarn lint:check
      - run: yarn format:check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: myapp_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: corepack enable && corepack prepare yarn@4.11.0 --activate
      - run: yarn install --immutable
      - run: yarn workspace @repo/db db-generate
      - run: yarn workspace @repo/db db-migrate --name "ci"
      - run: yarn test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: corepack enable && corepack prepare yarn@4.11.0 --activate
      - run: yarn install --immutable
      - run: yarn build
      - run: docker build -f docker/Dockerfile.api.prod -t api .
      - run: docker build -f docker/Dockerfile.web.prod -t web .
```

**Deployment Pipeline (Suggested):**
1. Build and push Docker images to container registry
2. Deploy to staging environment
3. Run smoke tests
4. Promote to production (rolling update or blue/green)

---

## 9. Testing Strategy

### Test Folder Structure

```
tests/                              # Root-level cross-app tests
├── integration/                    # Integration tests (API + DB)
│   ├── auth.test.ts
│   └── user.test.ts
├── e2e/                            # End-to-end tests (Playwright / Cypress)
│   ├── auth.spec.ts
│   └── home.spec.ts
└── fixtures/                       # Test fixtures & seed data
    ├── users.ts
    └── db.ts

apps/
├── api/
│   └── src/
│       └── __tests__/              # Unit tests (co-located with source)
│           ├── service/
│           │   └── authService.test.ts
│           ├── controller/
│           │   └── authController.test.ts
│           ├── middleware/
│           │   └── authMiddleware.test.ts
│           └── utils/
│               ├── apiResponse.test.ts
│               └── apiError.test.ts
│
└── web/
    └── src/
        └── __tests__/              # Component & hook tests
            ├── components/
            │   └── Button.test.tsx
            ├── pages/
            │   └── Home.test.tsx
            └── hooks/
                └── useAuth.test.ts

packages/
├── db/
│   └── __tests__/
│       └── prisma.test.ts
└── ui/
    └── __tests__/
        └── Button.test.tsx
```

### Testing Stack (Recommended)

| Layer | Framework | Notes |
|---|---|---|
| **Unit tests** | Vitest | Fast, TypeScript-native, compatible with Vite |
| **React component tests** | Vitest + Testing Library | For UI components |
| **API integration tests** | Vitest + Supertest | Test Express routes with Prisma test DB |
| **E2E tests** | Playwright | Cross-browser, visual regression, API mocking |
| **DB tests** | Vitest + Prisma | Use test database or in-memory SQLite |

### Test Configuration

**Vitest config** (at root `vitest.config.ts` or per-app):

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",           // Use "jsdom" for React components
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["apps/*/src/**", "packages/*/src/**"],
    },
  },
});
```

### Testing Best Practices

1. **Co-locate unit tests** with source files (`__tests__/` next to implementation)
2. **Name test files** with `.test.ts` or `.spec.ts` suffix
3. **Use factories/fixtures** for test data (avoid hardcoding)
4. **Run DB-dependent tests** against a dedicated test database
5. **Mock external services** (JWT verification, third-party APIs)
6. **Test error paths** (validation errors, auth failures, not-found cases)

---

## 10. Scaffolding a New Project

### Option A: Add a New App to This Monorepo

```bash
# 1. Create the app directory
mkdir -p apps/my-new-app/src

# 2. Create package.json
cat > apps/my-new-app/package.json << 'EOF'
{
  "name": "my-new-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "...",
    "build": "...",
    "start": "...",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {},
  "devDependencies": {}
}
EOF

# 3. Create tsconfig extending shared config
cat > apps/my-new-app/tsconfig.json << 'EOF'
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src"]
}
EOF

# 4. Create turbo.json for the app
cat > apps/my-new-app/turbo.json << 'EOF'
{
  "extends": ["//"],
  "tasks": {
    "build": { "outputs": ["dist/**"] }
  }
}
EOF

# 5. Install dependencies
yarn workspace my-new-app add <dependencies>
yarn workspace my-new-app add -D <dev-dependencies>
```

### Option B: Create a New Monorepo from Scratch

```bash
# 1. Create directory and init
mkdir my-monorepo && cd my-monorepo
yarn init -y

# 2. Set Yarn version
yarn set version 4.11.0
corepack enable

# 3. Create workspace structure
mkdir -p apps/api/src apps/web/src packages

# 4. Create root package.json with workspaces field
# 5. Create turbo.json with task pipeline
# 6. Create tsconfig bases in packages/typescript-config/
# 7. Set up ESLint + Prettier + Husky
# 8. Create Dockerfiles for each app
# 9. Create docker-compose files
```

### Folder Creation Checklist

When creating a new **API app**, ensure it has:
- [ ] `package.json` with workspace scripts
- [ ] `tsconfig.json` extending `@repo/typescript-config/base.json`
- [ ] `turbo.json` (or just rely on root config)
- [ ] `nodemon.json` (if using hot-reload)
- [ ] `src/index.ts` (entry point)
- [ ] `src/app.ts` (Express setup)
- [ ] `src/config/`, `src/controller/`, `src/service/`, `src/repository/`, `src/routes/`, `src/middleware/`, `src/model/`, `src/validation/`, `src/utils/`, `src/lib/`
- [ ] `Dockerfile.api.dev` and `Dockerfile.api.prod` in `docker/`
- [ ] `__tests__/` directory

When creating a new **Web app** (Vite React), ensure it has:
- [ ] `package.json` with workspace scripts
- [ ] `tsconfig.json` extending `@repo/typescript-config/vite.json`
- [ ] `turbo.json`
- [ ] `vite.config.ts`
- [ ] `index.html`
- [ ] `src/main.tsx` (entry point)
- [ ] `src/app/` (Layout, router, providers)
- [ ] `src/pages/`, `src/components/`, `src/redux/`, `src/hooks/`, `src/helper/`, `src/config/`, `src/utils/`, `src/styles/`
- [ ] `Dockerfile.web.dev` and `Dockerfile.web.prod` in `docker/`
- [ ] `__tests__/` directory

When creating a **Web app** (Next.js), ensure it has:
- [ ] `package.json` with workspace scripts
- [ ] `tsconfig.json` extending `@repo/typescript-config/next.json`
- [ ] `next.config.ts`
- [ ] `postcss.config.mjs`
- [ ] `src/app/` (App Router structure)
- [ ] `src/components/`, `src/lib/`, `src/hooks/`, `src/styles/`
- [ ] Dockerfiles for Next.js (dev + prod)

---

## Conventions Summary

| Convention | Rule |
|---|---|
| **Package manager** | Yarn 4 (Berry) with `corepack` |
| **Monorepo** | Turborepo with `apps/*` and `packages/*` |
| **TypeScript** | Strict mode, shared tsconfigs in `@repo/typescript-config` |
| **API architecture** | Route → Validation → Controller → Service → Repository → Prisma |
| **Response format** | Standard `ApiResponse` envelope (`{ statusCode, data, message, success }`) |
| **Error handling** | Custom `apiError` class + global `errorHandler` middleware |
| **Validation** | Zod schemas for all request inputs |
| **Database** | Prisma ORM with PostgreSQL 17 |
| **Frontend state** | Redux Toolkit + RTK Query (or Zustand for simpler apps) |
| **Styling** | Tailwind CSS (v4 with `@tailwindcss/vite`) |
| **Logging** | Winston (structured JSON logs) |
| **Docker** | Multi-stage builds for production, bind-mounts for dev |
| **Code quality** | ESLint + Prettier + Husky + lint-staged |
| **Testing** | Vitest (unit/integration), Playwright (E2E), co-located `__tests__/` |
