# Build stage
FROM node:18-bullseye-slim AS builder

# Install OpenSSL and other required packages for building
RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Build the application
RUN npm run build

# Production stage
FROM node:18-bullseye-slim AS production

# Install OpenSSL and other required packages
RUN apt-get update && apt-get install -y \
    openssl \
    libssl1.1 \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema for migrations
COPY ../prisma ./prisma

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api || exit 1

# Start the application
CMD ["node", "dist/main"]
