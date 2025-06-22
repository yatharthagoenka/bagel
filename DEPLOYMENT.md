# Bagel Deployment Guide

This guide explains how to deploy the Bagel application with the Go API server on GCP Compute Engine.

## Architecture

The application consists of three main services:
- **Web Frontend**: React application (port 3000)
- **API Server**: Go server with Firestore integration (port 4000)
- **Nginx**: Reverse proxy with SSL termination (ports 80/443)

## Environment Variables

Create a `.env` file in your deployment directory with the following variables:

```bash
# Docker image names
WEB_IMAGE_NAME=username/bagel-web:latest
APP_IMAGE_NAME=username/bagel-app:latest
NGINX_IMAGE_NAME=username/nginx:latest

# Google Cloud Platform Configuration
GCP_PROJECT_ID=your-gcp-project-id
PINBOARD_COLLECTION=pinboard
```

## Required GitHub Secrets

Add these secrets to your GitHub repository:

### Docker Hub
- `DOCKERHUB_USER`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Your Docker Hub access token

### Deployment Server
- `VM_HOST`: Your GCP Compute Engine instance IP/hostname
- `VM_USER`: Username for SSH access
- `MAC_SSH_PRIVATE_KEY`: SSH private key for server access

### Google Cloud Platform
- `GCP_PROJECT_ID`: Your GCP project ID
- `PINBOARD_COLLECTION`: Firestore collection name (e.g., "pinboard")

## GCP Compute Engine Setup

### Instance Service Account
Your GCP Compute Engine instance should have a service account with these permissions:
- **Cloud Datastore User** (for Firestore access)
- **Or custom role with**: `datastore.entities.*` permissions

### Create Instance with Service Account
```bash
gcloud compute instances create bagel-server \
  --service-account=your-service-account@your-project.iam.gserviceaccount.com \
  --scopes=https://www.googleapis.com/auth/datastore
```

## API Endpoints

The Go server provides the following endpoints:

### Create Pin
```bash
POST /api/pin
Content-Type: application/json

{
  "message": "Your pin message"
}
```

### Get All Pins
```bash
GET /api/pin
```

Response:
```json
{
  "data": {
    "pins": [
      {
        "message": "First pin message"
      },
      {
        "message": "Second pin message"
      }
    ]
  }
}
```

## Local Development

To run the services locally:

1. Build the API server:
   ```bash
   cd app
   docker build -t bagel-app .
   ```

2. Set environment variables:
   ```bash
   export BAGEL_APP_PORT=4000
   export BAGEL_GCP_PROJECT_ID=your-project-id
   export BAGEL_FS_PINBOARD_COLLECTION=pinboard
   ```

3. Run with docker-compose:
   ```bash
   docker-compose up -d
   ```

## Nginx Configuration

Nginx is configured to:
- Handle SSL termination for HTTPS
- Proxy `/api/*` requests to the Go server on port 4000
- Proxy all other requests to the React frontend on port 3000

## Firestore Setup

1. Create a GCP project
2. Enable Firestore API
3. Ensure your Compute Engine instance has proper service account permissions
4. No service account key file needed!

## Authentication

The Go application uses **GCP metadata service** for authentication:
- No service account key files required
- Uses the Compute Engine instance's attached service account
- Automatically handled by Google Cloud client libraries

## Troubleshooting

### API Server Issues
- Check container logs: `docker logs bagel-app`
- Verify environment variables are set correctly
- Ensure instance service account has Firestore permissions

### Authentication Issues
- Verify instance has a service account attached
- Check service account has `datastore.entities.*` permissions
- Test with: `gcloud auth list` on the instance

### Connection Issues
- Verify firewall rules allow traffic on ports 80, 443, 3000, and 4000
- Check nginx configuration syntax: `nginx -t`
- Ensure all services are running: `docker-compose ps` 