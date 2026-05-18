# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

# Chỉ copy production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled output từ builder
COPY --from=builder /app/dist ./dist

# Copy .env (sẽ bị override bởi env_file trong docker-compose)
COPY .env* ./

# Tạo thư mục uploads
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "dist/main"]

# ── Stage 3: Seeder (cần devDeps như @faker-js/faker) ───────────────────────
FROM node:22-alpine AS seeder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY .env* ./

CMD ["node", "dist/database/seed.js", "all"]
