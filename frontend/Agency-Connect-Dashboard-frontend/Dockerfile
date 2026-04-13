# ========================================
# ÉTAPE 1 : BUILD (Compilation Vite/React)
# ========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Compiler l'application
RUN npm run build

# ========================================
# ÉTAPE 2 : SERVEUR WEB (Nginx)
# ========================================
FROM nginx:alpine

# Copier les fichiers compilés
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port HTTP par défaut
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]