# ── Stage 1: Build the Vite app ──────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install all deps (including devDependencies for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY index.html ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY eslint.config.js ./
COPY src/ ./src/

# Copy .env to the location Vite expects (envDir: '../../' means 2 levels up)
# We place it at /env/.env so envDir resolves correctly at /app -> ../../ = /
# Instead, override envDir by placing .env in the current dir
# We'll set envDir to './' via env or just place .env here
ARG VITE_API_URL=http://localhost:4000/api
ENV VITE_API_URL=$VITE_API_URL

# Build the app (Vite reads VITE_* from process.env too)
RUN npm run build

# ── Stage 2: Serve with nginx ────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
