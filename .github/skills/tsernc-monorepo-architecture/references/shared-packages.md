# Shared Packages (`packages/*`)

## Directory Structure

```
packages/
├── db/                      # Prisma ORM
├── env/                     # Environment variable validation
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

## Package Naming Convention

| Directory                    | Package Name              |
| ---------------------------- | ------------------------- |
| `packages/db`                | `@repo/db`                |
| `packages/env`               | `@repo/env`               |
| `packages/eslint-config`     | `@repo/eslint-config`     |
| `packages/prettier-config`   | `@repo/prettier-config`   |
| `packages/typescript-config` | `@repo/typescript-config` |
| `packages/ui`                | `@repo/ui`                |

## Exports Pattern (package.json)

```jsonc
{
  "exports": {
    "./client": "./src/index.ts", // e.g., @repo/db/client
    "./utils": "./src/utils.ts", // e.g., @repo/db/utils
  },
}
```

---

# Database Layer (`@repo/db`)

**Stack:** Prisma ORM 7.x + PostgreSQL 17

## Directory Structure

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

## Scripts

```jsonc
{
  "scripts": {
    "db-generate": "prisma generate",
    "db-migrate": "prisma migrate dev",
    "db-seed": "tsx src/seed.ts",
    "db-reset": "prisma migrate reset",
  },
}
```

## Prisma Schema Example

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

## Prisma Client Singleton

Exports a cached PrismaClient singleton to prevent connection exhaustion during hot-reloads.
