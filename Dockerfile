FROM ghcr.io/pnpm/pnpm:11.5.0 AS install-deps

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm i --frozen-lockfile --store-dir /pnpm/store

FROM node:26-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .
COPY --from=install-deps /app/node_modules ./node_modules

RUN node --run build

FROM nginx:1-alpine

COPY --from=builder /app/dist/client /usr/share/nginx/html

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
