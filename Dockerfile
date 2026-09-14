# Build the prerendered site, then serve it with nginx.
# Coolify: choose "Dockerfile" as the build pack; the container listens on port 80.

FROM node:24-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .
# Public origin used for absolute URLs in prerendered output (RSS feed).
ARG SITE_ORIGIN=http://localhost:4173
ENV SITE_ORIGIN=$SITE_ORIGIN
RUN pnpm build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
