# Stage 1: Build TypeScript
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies and tsconfig
COPY server/package*.json ./
COPY server/tsconfig*.json ./
COPY server/tsconfig.build.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source and shared code
COPY server/ ./ 
COPY shared/ ../shared

# Build TypeScript using the build config
RUN npm run build

# -------------------------------
# Stage 2: Run built JS
# -------------------------------
FROM node:18-alpine

WORKDIR /app

# Copy only prod deps and built code
COPY server/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY shared/ ../shared

EXPOSE 5000
CMD ["node", "dist/index.js"]
