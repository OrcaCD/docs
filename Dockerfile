FROM node:25-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY --exclude=node_modules . .
RUN npm ci

RUN npm run build

FROM nginx:1-alpine

COPY --from=builder /app/dist/client /usr/share/nginx/html

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
