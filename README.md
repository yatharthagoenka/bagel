# bagel
brewing...

### Frontend

Totally vibe coded, AI is a bliss when you know how to use it.
If you see trash code though, don't blame me.


### CI/CD and Backend

This is more me, still not denying that I write trash code.
Feel free to contribute or ask anything!

### Infra

- GCP 
  - Firestore
  - Compute Engine

- Domain
  - Porkbun


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