# Scaffolding a New Project

## Option A: Add a New App to This Monorepo

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

## Option B: Scaffold a New Shared Package

```bash
# 1. Create the package directory
mkdir -p packages/my-package/src

# 2. Create package.json with @repo scope
cat > packages/my-package/package.json << 'EOF'
{
  "name": "@repo/my-package",
  "version": "1.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "lint": "eslint src --ext .ts"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
    "typescript": "^5.9"
  }
}
EOF

# 3. Create tsconfig extending shared config
cat > packages/my-package/tsconfig.json << 'EOF'
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  },
  "include": ["src"]
}
EOF

# 4. Install dependency
yarn workspace @repo/my-package add -D typescript
```

## Option C: Restructure an Existing Vibe-Coded Project

If you have an existing project built without proper structure, follow these steps to migrate it into the monorepo architecture.

### Phase 1: Create the Monorepo Skeleton

```bash
# Create directory structure
mkdir -p apps/api/src apps/web/src packages
mkdir -p docker tests

# Create root files (see Option A/B for templates)
# - package.json (workspace config)
# - turbo.json (task pipeline)
# - tsconfig.json (root ref)
# - .eslintrc.js / .prettierrc
```

### Phase 2: Analyze & Extract

1. **Scan the existing codebase** — identify these categories:
   - **API code** (routes, controllers, DB logic) → `apps/api/src/`
   - **Frontend code** (pages, components, state) → `apps/web/src/`
   - **Shared utilities** (types, helpers, constants) → `packages/shared/`
   - **Database models/schemas** → `packages/db/`
   - **Config files** (eslint, tsconfig, env) → `packages/*-config/`

2. **Draw the dependency graph** — understand what depends on what

### Phase 3: Migrate Incrementally

Start with the most independent pieces first:

```bash
# 1. Extract shared packages first (zero dependencies on apps)
mkdir -p packages/types/src
# Move shared types/interfaces here

# 2. Extract DB layer
mkdir -p packages/db/src packages/db/prisma
# Move schema, migrations, DB client

# 3. Extract API into layered architecture
mkdir -p apps/api/src/{routes,controller,service,repository,middleware,validation,utils}
# Split existing code into proper layers

# 4. Extract frontend
mkdir -p apps/web/src/{pages,components,redux,hooks,utils,styles}
# Move components, pages, state management

# 5. Add Docker, CI/CD, testing configs
mkdir -p docker nginx
```

### Phase 4: Verify & Iterate

```bash
# Install all dependencies
yarn install

# Build everything
yarn build

# Run lint
yarn lint:check

# Test
yarn test
```

### Migration Checklist

- [ ] Root `package.json` with workspace config created
- [ ] `turbo.json` with build/dev/lint tasks configured
- [ ] Shared types extracted into a package
- [ ] Database schema/migrations in `packages/db/`
- [ ] API code split into Controller → Service → Repository layers
- [ ] Frontend code organized into pages/components/state
- [ ] Shared configs (tsconfig, ESLint, Prettier) extracted
- [ ] Docker compose files created for dev & prod
- [ ] All imports updated to workspace package references
- [ ] `yarn build` succeeds end-to-end

## Scaffolding Checklist

- [ ] `package.json` created with correct `name` (or `@repo/` scope for packages)
- [ ] `tsconfig.json` extends the appropriate `@repo/typescript-config/*` base
- [ ] `turbo.json` created (for apps) extending root config
- [ ] `Dockerfile` created in `docker/` (for deployable apps)
- [ ] Workspace added to root `package.json` if needed
- [ ] Dependencies installed via `yarn workspace`
- [ ] Dependencies installed via `yarn workspace`
