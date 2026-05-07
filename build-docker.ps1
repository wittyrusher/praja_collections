# Stop and remove existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Remove old images (optional)
Write-Host "🗑️  Removing old images..." -ForegroundColor Yellow
docker rmi praja-collections-app -ErrorAction SilentlyContinue

# Build new image
Write-Host "🔨 Building Docker image..." -ForegroundColor Cyan
docker-compose build

# Start containers
Write-Host "🚀 Starting containers..." -ForegroundColor Green
docker-compose up -d

# Show running containers
Write-Host "`n✅ Containers started successfully!" -ForegroundColor Green
docker-compose ps

# Show logs
Write-Host "`n📋 Application logs:" -ForegroundColor Cyan
docker-compose logs -f app