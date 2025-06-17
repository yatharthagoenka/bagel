# Bagel Web App

## Docker Build & Run

Build the Docker image:

```sh
docker build -t bagel-demo .
```

Run the container:

```sh
docker run -p 80:80 bagel-demo
```

## Deploying to GCP E2 Micro from GitHub

1. Push this repo to GitHub.
2. Create a GCP E2 Micro VM (Ubuntu recommended).
3. Install Docker on the VM:
   ```sh
   sudo apt update && sudo apt install -y docker.io
   sudo systemctl start docker
   sudo systemctl enable docker
   ```
4. Clone your repo on the VM:
   ```sh
   git clone <your-repo-url>
   cd web
   ```
5. Build and run the Docker image as above.
6. Open port 80 in your GCP firewall settings.

Your app will be available at `http://<your-vm-external-ip>/`.
