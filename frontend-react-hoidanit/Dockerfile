# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Build arg để inject VITE env lúc build
ARG VITE_API_BASE_URL=http://localhost:3000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve với Nginx ─────────────────────────────────────────────────
FROM nginx:alpine AS production

# Xoá config mặc định của nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy nginx config tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files từ builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
