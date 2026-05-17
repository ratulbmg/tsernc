FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.11.0 --activate

# Dependency manifests (same caching strategy as API)
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

COPY apps/api/package.json         ./apps/api/
COPY apps/web/package.json         ./apps/web/
COPY packages/db/package.json      ./packages/db/
COPY packages/ui/package.json      ./packages/ui/
COPY packages/eslint-config/       ./packages/eslint-config/
COPY packages/prettier-config/     ./packages/prettier-config/
COPY packages/typescript-config/   ./packages/typescript-config/

RUN yarn install --immutable && yarn cache clean

# Default Vite dev port + optional preview port
EXPOSE 5173