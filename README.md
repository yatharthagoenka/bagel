# bagel
brewing...


### Setup SSL (first time only)

```bash
docker run -it --rm \
  -v /etc/letsencrypt:/etc/letsencrypt \
  -v /var/lib/letsencrypt:/var/lib/letsencrypt \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  --agree-tos --no-eff-email --email your-email@example.com \
  -d bagel.ac -d www.bagel.ac
```