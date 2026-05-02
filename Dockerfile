# =============================================================
# DOCKERFILE — FRONTEND VITE / REACT
# Pas de Nginx. Le container sert l'app via "vite preview"
# (équivalent prod de "npm run dev", sert le /dist buildé).
# La terminaison HTTP / reverse proxy est gérée par le
# docker-compose infra du serveur.
# =============================================================

# -----------------------------------------------------------
# STAGE 1 — builder
# -----------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .

# --- VITE_* injectées via --build-arg au moment du build ---
ARG VITE_API_URL

RUN printf "VITE_API_URL=%s\n"\
  "$VITE_API_URL" \
  > .env

RUN npm run build

# -----------------------------------------------------------
# STAGE 2 — runner
# Node Alpine léger. On garde node_modules uniquement pour
# vite preview (vite doit être dans les devDependencies).
# -----------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts

EXPOSE 3000

#HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
#  CMD wget -qO- http://localhost:3000/ || exit 1

# vite preview sert le /dist buildé sur le port 4173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]