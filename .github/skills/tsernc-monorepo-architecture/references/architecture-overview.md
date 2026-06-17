# Monorepo Overview & Root Layout

## Overview

This project uses **Turborepo** with **Yarn 4** (Berry) workspaces to manage multiple applications and shared packages in a single repository.

| Tool                      | Version / Config                |
| ------------------------- | ------------------------------- |
| **Package manager**       | Yarn 4.11.0 (`corepack enable`) |
| **Monorepo orchestrator** | Turborepo 2.x                   |
| **Node.js**               | 22 (Alpine in Docker)           |
| **TypeScript**            | ^5.9                            |

### Key Principles

- **`apps/*`** — Deployable applications (API, Web, etc.)
- **`packages/*`** — Shared libraries consumed by apps
- **`turbo.json`** at root defines task pipelines (`build`, `dev`, `start`, `lint`)
- All apps and packages use `tsconfig` that extends `@repo/typescript-config/*`
- ESLint + Prettier run across the entire monorepo
- Husky + lint-staged enforce code quality on commit

## Root `turbo.json` Task Configuration

```jsonc
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true,
    },
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**"],
    },
    "start": {
      "dependsOn": ["build"],
      "persistent": true,
      "cache": false,
    },
    "lint": {
      "outputs": [],
    },
  },
}
```

## Root-Level Layout

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

## Root `package.json` Scripts

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
    "docker:dev:restart": "docker compose -f docker-compose.dev.yml restart",
  },
}
```
