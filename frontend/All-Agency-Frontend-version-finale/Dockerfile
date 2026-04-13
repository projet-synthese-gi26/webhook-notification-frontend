# ========================================
# ÉTAPE 1 : BUILD (Compilation de l'application React/Vite)
# ========================================
FROM node:20-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer les dépendances (npm ci est plus sûr pour la CI/CD que npm install)
RUN npm ci

# Copier le reste du code
COPY . .

# Compiler le projet Vite (génère le dossier /dist)
RUN npm run build

# ========================================
# ÉTAPE 2 : SERVEUR WEB (Nginx pour servir le site)
# ========================================
FROM nginx:alpine

# Copier les fichiers compilés depuis l'étape 1 vers le dossier d'Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80 (port HTTP standard)
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]