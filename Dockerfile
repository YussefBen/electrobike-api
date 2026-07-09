# --- Étape 1 : installation des dépendances de production ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src ./src

# --- Étape 2 : image finale allégée ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src ./src
COPY package*.json ./

EXPOSE 3000
USER node
CMD ["node", "src/server.js"]
