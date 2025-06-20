FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /var/www/certbot

# Expose default HTTP and HTTPS ports
EXPOSE 80 443
