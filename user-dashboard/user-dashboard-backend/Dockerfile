FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source
COPY src/ ./src/

# Create non-root user for security
RUN groupadd -r sentinel && useradd -r -g sentinel sentinel
USER sentinel

EXPOSE 4001

CMD ["node", "src/server.js"]
