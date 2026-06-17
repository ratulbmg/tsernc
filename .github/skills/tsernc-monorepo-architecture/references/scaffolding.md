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

## Scaffolding Checklist

- [ ] `package.json` created with correct `name` (or `@repo/` scope for packages)
- [ ] `tsconfig.json` extends the appropriate `@repo/typescript-config/*` base
- [ ] `turbo.json` created (for apps) extending root config
- [ ] `Dockerfile` created in `docker/` (for deployable apps)
- [ ] Workspace added to root `package.json` if needed
- [ ] Dependencies installed via `yarn workspace`
