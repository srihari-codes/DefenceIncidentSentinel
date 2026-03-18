# ── Stage 1: Build the Vite app ──────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and install all deps (including devDependencies for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY index.html ./
COPY vite.config.js ./
COPY eslint.config.js ./
COPY src/ ./src/

# VITE_* env vars baked into the build
ARG VITE_API_BASE_URL=http://localhost:4001
ARG VITE_AUTH_SERVICE_URL=http://localhost:4000
ARG VITE_AUTH_FRONTEND_URL=http://localhost:5173
ARG VITE_DASHBOARD_URL=http://localhost:5174
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AUTH_SERVICE_URL=$VITE_AUTH_SERVICE_URL
ENV VITE_AUTH_FRONTEND_URL=$VITE_AUTH_FRONTEND_URL
ENV VITE_DASHBOARD_URL=$VITE_DASHBOARD_URL

# Build the app
RUN npm run build

# ── Stage 2: Serve with nginx ────────────────────────────────────────
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
