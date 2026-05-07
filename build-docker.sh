#!/bin/bash

# Stop and remove existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional)
echo "🗑️  Removing old images..."
docker rmi praja-collections-app 2>/dev/null || true

# Build new image
echo "🔨 Building Docker image..."
docker-compose build

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d

# Show running containers
echo ""
echo "✅ Containers started successfully!"
docker-compose ps

# Show logs
echo ""
echo "📋 Application logs:"
docker-compose logs -f app