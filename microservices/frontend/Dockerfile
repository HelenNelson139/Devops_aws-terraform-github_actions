FROM nginx:1.29-alpine

RUN apk upgrade --no-cache

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public /usr/share/nginx/html
COPY admin /usr/share/nginx/html/admin

EXPOSE 80
