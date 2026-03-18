# ── Stage 1: Build native dependencies (argon2) ──────────────────────
FROM node:20-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: Production runtime ──────────────────────────────────────
FROM node:20-slim

WORKDIR /app

# Copy built node_modules (includes native argon2 bindings)
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY package.json ./
COPY server.js ./
COPY src/ ./src/

# Create non-root user for security
RUN groupadd -r sentinel && useradd -r -g sentinel sentinel
USER sentinel

EXPOSE 4000

CMD ["node", "server.js"]
