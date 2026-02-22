# Weather Travel - Deployment Guide

## 🚀 Deployment Options

This guide covers deployment using Docker, Docker Compose, and CI/CD pipelines.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Docker Development](#local-docker-development)
3. [Production Deployment](#production-deployment)
4. [CI/CD Setup](#cicd-setup)
5. [Cloud Deployment](#cloud-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Software

- Docker (v20.10+)
- Docker Compose (v2.0+)
- Node.js (v18+) - for local development
- Git

### Required Accounts

- MongoDB Atlas account (or local MongoDB)
- OpenWeatherMap API key
- Gmail account with App Password (for emails)
- GitHub account (for CI/CD)
- Cloud hosting account (AWS, DigitalOcean, etc.)

---

## Local Docker Development

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/weathertravel.git
cd weathertravel
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.docker.example .env

# Edit .env file with your credentials
nano .env
```

### 3. Build and Run

```bash
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Access Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379

### 5. Useful Docker Commands

```bash
# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# View logs for specific service
docker-compose logs -f backend

# Execute command in container
docker-compose exec backend sh

# Remove all volumes (fresh start)
docker-compose down -v
```

---

## Production Deployment

### Option 1: VPS Deployment (DigitalOcean, Linode, etc.)

#### Step 1: Prepare Server

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Create app directory
mkdir -p /var/www/weathertravel
cd /var/www/weathertravel
```

#### Step 2: Clone and Configure

```bash
# Clone repository
git clone https://github.com/yourusername/weathertravel.git .

# Create environment file
cp .env.docker.example .env
nano .env  # Add your credentials
```

#### Step 3: Deploy

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Step 4: Setup SSL (Let's Encrypt)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

### Option 2: AWS Deployment

#### Using AWS ECS (Elastic Container Service)

1. **Create ECR Repositories**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL

# Create repositories
aws ecr create-repository --repository-name weathertravel-backend
aws ecr create-repository --repository-name weathertravel-frontend
```

2. **Build and Push Images**

```bash
# Backend
docker build -t weathertravel-backend ./server
docker tag weathertravel-backend:latest YOUR_ECR_URL/weathertravel-backend:latest
docker push YOUR_ECR_URL/weathertravel-backend:latest

# Frontend
docker build -t weathertravel-frontend ./client
docker tag weathertravel-frontend:latest YOUR_ECR_URL/weathertravel-frontend:latest
docker push YOUR_ECR_URL/weathertravel-frontend:latest
```

3. **Create ECS Task Definition**

Use the AWS Console or CLI to create task definitions for backend and frontend.

4. **Create ECS Service**

Set up Application Load Balancer, Target Groups, and ECS Service.

### Option 3: Heroku Deployment

#### Backend (Heroku)

```bash
# Login to Heroku
heroku login

# Create app
heroku create weathertravel-api

# Add MongoDB addon or use MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set WEATHER_API_KEY=your_key

# Deploy
git subtree push --prefix server heroku main
```

#### Frontend (Vercel/Netlify)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod
```

---

## CI/CD Setup

### GitHub Actions (Included)

The project includes a complete CI/CD pipeline in `.github/workflows/ci-cd.yml`.

#### Step 1: Configure Secrets

Go to GitHub repository → Settings → Secrets and add:

- `DEPLOY_HOST` - Your server IP
- `DEPLOY_USER` - SSH username
- `DEPLOY_SSH_KEY` - Private SSH key
- `DOCKER_USERNAME` - Docker Hub username (if using)
- `DOCKER_PASSWORD` - Docker Hub password

#### Step 2: Push to Main Branch

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

The pipeline will:
1. Run tests
2. Build Docker images
3. Push to registry
4. Deploy to server
5. Run security scans

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - cd server && npm ci && npm test
    - cd ../client && npm ci && npm test

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t weathertravel-backend ./server
    - docker build -t weathertravel-frontend ./client

deploy:
  stage: deploy
  script:
    - ssh $DEPLOY_USER@$DEPLOY_HOST "cd /var/www/weathertravel && docker-compose pull && docker-compose up -d"
  only:
    - main
```

---

## Cloud Deployment

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - Backend: Dockerfile at `server/Dockerfile`
   - Frontend: Dockerfile at `client/Dockerfile`
3. Set environment variables
4. Deploy

### Google Cloud Run

```bash
# Build and submit
gcloud builds submit --tag gcr.io/PROJECT_ID/weathertravel-backend ./server
gcloud builds submit --tag gcr.io/PROJECT_ID/weathertravel-frontend ./client

# Deploy
gcloud run deploy weathertravel-backend --image gcr.io/PROJECT_ID/weathertravel-backend
gcloud run deploy weathertravel-frontend --image gcr.io/PROJECT_ID/weathertravel-frontend
```

### Azure Container Instances

```bash
# Create resource group
az group create --name weathertravel-rg --location eastus

# Create container
az container create \
  --resource-group weathertravel-rg \
  --name weathertravel-backend \
  --image your-registry/weathertravel-backend \
  --dns-name-label weathertravel-api \
  --ports 5000
```

---

## Monitoring & Maintenance

### Health Checks

All containers include health checks. Monitor with:

```bash
docker-compose ps
```

### Logging

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Backups

#### MongoDB Backup

```bash
# Backup
docker-compose exec mongodb mongodump --out /data/backup

# Restore
docker-compose exec mongodb mongorestore /data/backup
```

#### Automated Backup Script

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T mongodb mongodump --archive | gzip > backup_$DATE.gz
```

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Clean up old images
docker system prune -af
```

### Performance Monitoring

Use tools like:
- **PM2** for Node.js process management
- **New Relic** for application monitoring
- **Datadog** for infrastructure monitoring
- **Prometheus + Grafana** for metrics

---

## Scaling

### Horizontal Scaling

```yaml
# In docker-compose.prod.yml
backend:
  deploy:
    replicas: 3
```

### Load Balancing

Use Nginx or cloud load balancers to distribute traffic across replicas.

### Database Scaling

Consider MongoDB Atlas auto-scaling or read replicas.

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check environment variables
docker-compose exec backend env

# Inspect container
docker inspect weathertravel-backend
```

### Database Connection Issues

```bash
# Test MongoDB connection
docker-compose exec backend node -e "require('./config/db')()"

# Check network
docker network inspect weathertravel_weathertravel-network
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# Set memory limits in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 512M
```

---

## Security Checklist

- [ ] Use strong passwords for all services
- [ ] Enable SSL/TLS (HTTPS)
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Implement monitoring and alerts
- [ ] Use non-root users in containers
- [ ] Scan images for vulnerabilities

---

## Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/weathertravel/issues)
- Documentation: [Full docs](https://github.com/yourusername/weathertravel/wiki)

---

## License

MIT License - see LICENSE file for details
