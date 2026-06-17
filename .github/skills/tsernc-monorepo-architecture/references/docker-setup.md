# Docker & CI/CD

## Development Environment

**File:** `docker-compose.dev.yml`

Three services:

| Service | Container         | Image         | Port   | Purpose                             |
| ------- | ----------------- | ------------- | ------ | ----------------------------------- |
| `db`    | `tsernc-postgres` | `postgres:17` | `5432` | PostgreSQL database                 |
| `api`   | `tsernc-api`      | custom (dev)  | `3001` | Express API with nodemon hot-reload |
| `web`   | `tsernc-web`      | custom (dev)  | `5173` | Vite dev server with HMR            |

**Key features:**

- Bind-mounts entire monorepo for live code sync
- Anonymous volumes prevent host `node_modules` shadowing
- `CHOKIDAR_USEPOLLING=1` + `WATCHPACK_POLLING=true` for file watching in Docker
- Health check on `db` ensures API waits for PostgreSQL
- Shared network `app-network` for inter-service communication

### Usage

```bash
# Start all services
docker compose -f docker-compose.dev.yml up -d

# Stop all services
docker compose -f docker-compose.dev.yml down

# Tail logs
docker compose -f docker-compose.dev.yml logs -f

# Force rebuild (e.g., after dependency changes)
docker compose -f docker-compose.dev.yml build --no-cache

# Restart services
docker compose -f docker-compose.dev.yml restart

# Run commands inside a service
docker compose -f docker-compose.dev.yml exec api yarn workspace @repo/db db-migrate
```

## Production Environment

**File:** `docker-compose.prod.yml`

Three services:

| Service | Image Source                     | Purpose                                        |
| ------- | -------------------------------- | ---------------------------------------------- |
| `db`    | `postgres:17`                    | PostgreSQL database                            |
| `api`   | Multistage `Dockerfile.api.prod` | Compiled Express app                           |
| `nginx` | Multistage `Dockerfile.web.prod` | Nginx serving built SPA + reverse proxy to API |

Nginx config (`nginx/nginx.prod.conf`):

- Serves the built web app (via `proxy_pass` to `web:5173`)
- Proxies `/api/*` to API server (strips `/api` prefix)
- Serves `/api-docs` (Swagger UI)

## Dockerfile Structure

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

## CI/CD Pipeline (Suggested)

```yaml
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
