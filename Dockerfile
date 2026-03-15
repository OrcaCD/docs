FROM node:25-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist/client /usr/share/nginx/html/docs

RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
\n\
    location /docs {\n\
        try_files $uri $uri/ /docs/index.html;\n\
    }\n\
\n\
    location = / {\n\
        return 301 /docs;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
