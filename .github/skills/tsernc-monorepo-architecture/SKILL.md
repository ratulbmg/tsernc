---
name: fullstack-monorepo-architecture
description: "Full-stack monorepo skill for React, Node.js/Express, and Next.js development using Turborepo + Yarn 4. Use when building new projects from scratch, restructuring vibe-coded projects, or building API backends, React/Vite frontends, Next.js SSR apps, shared packages, Prisma DB layer, Docker environments. NOT for simple HTML/CSS/JS static sites or vanilla JS projects."
---

# Full-Stack Monorepo Architecture

A comprehensive reference for building and restructuring full-stack monorepo projects using **React**, **Node.js/Express**, **Next.js**, Turborepo, Yarn 4 workspaces, Prisma, Docker, and TypeScript.

## When to Use

Use this skill in the following scenarios:

### Build a New Project From Scratch
Scaffold a new full-stack monorepo with proper structure from day one. Use the patterns here to set up:
- **React (Vite)** or **Next.js** frontend (SSR/SSG for SEO)
- **Node.js / Express** API backend
- Shared **TypeScript packages** (database, UI, env, configs)
- **Prisma ORM** + PostgreSQL database layer
- **Docker** development & production environments

### Restructure a Vibe-Coded Project
Take an existing project that was quickly built (vibe-coded) without proper architecture and restructure it into a clean, maintainable monorepo:
- Split a monolithic codebase into `apps/` and `packages/`
- Add proper layered architecture (Controller → Service → Repository)
- Introduce shared packages for DRY code
- Set up Turborepo task orchestration
- Add Docker, testing, and linting

### Day-to-Day Development
- Adding new features to existing monorepo apps
- Creating new shared packages
- Managing database migrations
- Running Docker environments

**Do NOT use** for:
- Simple HTML/CSS/JS static websites
- Vanilla JavaScript projects without a framework
- Single-app projects (non-monorepo)

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

### 4. Optimize for SEO (Next.js)

When building public-facing websites, use **Next.js** (not Vite React) for server-side rendering and SEO:

- **Metadata API** — Set per-page titles, descriptions, and Open Graph tags via metadata exports in `layout.tsx` or `page.tsx`
- **Semantic HTML** — Use proper `<h1>`–`<h6>`, `<article>`, `<section>`, `<nav>` landmarks
- **SSR / SSG / ISR** — Server Components for dynamic content, static generation for blogs/pages, ISR for frequently updated content
- **Structured Data** — Add JSON-LD schema markup (BreadcrumbList, Article, Product, FAQ, etc.)
- **Sitemap & Robots** — Auto-generate `sitemap.xml` and `robots.txt` via Next.js config
- **Core Web Vitals** — Optimize LCP (images, fonts), INP (interactivity), CLS (layout shifts) using Next.js Image, font optimization, and caching
- **SEO audit checklist** — Verify lighthouse scores, meta tags, canonical URLs, and mobile responsiveness

See [web-frontend.md](./references/web-frontend.md) → "Next.js SEO Best Practices" section.

### 5. Use or Modify Shared Packages

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

### 6. Manage Database

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

### 7. Add a New App or Package

```bash
# Create app directory
mkdir -p apps/my-app/src

# Create package.json with workspace name
# Create tsconfig extending @repo/typescript-config/*
# Create turbo.json extending root
# Install deps with yarn workspace
```

See [scaffolding.md](./references/scaffolding.md) for full template and checklist.

### 8. Restructure a Vibe-Coded Project

If you have an existing project built quickly without proper structure, follow this process to migrate it into the monorepo architecture:

```bash
# 1. Create the monorepo skeleton
mkdir -p apps/api/src apps/web/src packages/
# Create root package.json, turbo.json, tsconfig
```

**Migration steps:**

1. **Analyze** the existing codebase — identify API code, frontend code, shared utilities
2. **Move API code** into `apps/api/src/` following Controller → Service → Repository layers
3. **Move frontend code** into `apps/web/src/` following pages/components/redux pattern
4. **Extract shared code** (types, utils, DB models) into `packages/*`
5. **Add missing configs** — tsconfig, ESLint, Prettier, Docker, CI
6. **Incrementally adopt** — you don't need to move everything at once; migrate piece by piece

See [scaffolding.md](./references/scaffolding.md) for template files, and [docker-setup.md](./references/docker-setup.md) for Docker setup.

### 9. Run Tests

Tests are co-located in `__tests__/` directories using Vitest, with E2E tests using Playwright.

See [testing.md](./references/testing.md) for test configuration and best practices.
