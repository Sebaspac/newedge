# NEWEDGE CMS (Strapi 5) — Production Image
# Multi-Stage: Builder kompiliert native Deps (better-sqlite3) + Admin-Panel,
# Runtime bleibt schlank. Datenbank in Produktion: Postgres (DATABASE_CLIENT=postgres).

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

# Build-Werkzeuge für native Module (better-sqlite3); sharp nutzt musl-Prebuilds.
RUN apk add --no-cache python3 make g++ vips-dev

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Admin-Panel bauen (braucht ~2 GB RAM)
ENV NODE_ENV=production
RUN npm run build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

RUN apk add --no-cache vips

WORKDIR /app
ENV NODE_ENV=production

# Nur Runtime-Artefakte übernehmen (node_modules sind im Builder kompiliert)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist ./dist
COPY --from=build /app/config ./config
COPY --from=build /app/src ./src
COPY --from=build /app/public ./public
COPY --from=build /app/data ./data
COPY --from=build /app/database ./database
COPY --from=build /app/favicon.png ./favicon.png
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Als non-root laufen; Uploads-Verzeichnis beschreibbar halten (Volume-Mountpoint)
RUN chown -R node:node /app
USER node

EXPOSE 1337

# Healthcheck gegen Strapis eingebauten Endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -qO- http://127.0.0.1:1337/_health || exit 1

CMD ["npm", "run", "start"]
