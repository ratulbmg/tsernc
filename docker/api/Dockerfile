FROM node:22-alpine

WORKDIR /app

# Corepack: enable Yarn 4
RUN corepack enable && corepack prepare yarn@4.11.0 --activate

# ----------------------------------------------------------------
# Dependency manifests — only these get copied first so Docker
# layer caching works: yarn install re-runs only when deps change.
# ----------------------------------------------------------------
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Every workspace package.json must exist for Yarn to resolve
COPY apps/api/package.json         ./apps/api/
COPY apps/web/package.json         ./apps/web/
COPY packages/db/package.json      ./packages/db/
COPY packages/ui/package.json      ./packages/ui/
COPY packages/env/package.json     ./packages/env/
COPY packages/eslint-config/       ./packages/eslint-config/
COPY packages/prettier-config/     ./packages/prettier-config/
COPY packages/typescript-config/   ./packages/typescript-config/

# Install all workspace dependencies
RUN yarn install --immutable && yarn cache clean

# Port used by the API dev server (nodemon → tsx)
EXPOSE 3001