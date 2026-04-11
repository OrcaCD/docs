FROM node:25-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .
RUN npm ci

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/client /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
