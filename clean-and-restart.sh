#!/bin/bash

# Stop all containers
echo "Stopping all containers..."
docker compose -f grocery-infra/docker-compose.yml down

# Remove all volumes
echo "Removing volumes..."
docker volume prune -f

# Rebuild and start containers
echo "Rebuilding and starting containers..."
docker compose -f grocery-infra/docker-compose.yml up --build -d

# Show logs
echo "Showing logs..."
docker compose -f grocery-infra/docker-compose.yml logs -f