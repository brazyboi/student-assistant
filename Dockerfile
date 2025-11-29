# Build stage - NO secrets passed here
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install all dependencies
RUN npm ci

# Copy source code
COPY shared ./shared
COPY server ./server
COPY client ./client

# Copy TypeScript configs and other necessary files
COPY shared/tsconfig.json ./shared/
COPY server/tsconfig.json ./server/
COPY client/tsconfig*.json ./client/
COPY client/vite.config.ts ./client/

# Build everything in order - NO environment variables needed for build
RUN npm run build:shared
RUN npm run build:server
RUN npm run build:client

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY server/package*.json ./server/

# Install only production dependencies
RUN npm ci --omit=dev --workspace=shared --workspace=server

# Copy built artifacts from builder
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/dist ./client/dist

# Copy shared package.json for module resolution
COPY --from=builder /app/shared/package.json ./shared/

# Set production environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the server - secrets come from runtime env vars via --env-file
CMD ["node", "server/dist/index.js"]