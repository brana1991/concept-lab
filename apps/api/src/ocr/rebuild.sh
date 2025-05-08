#!/bin/bash

# Stop running containers
docker compose down

# Rebuild and restart
docker compose build
docker compose up -d postgres
docker compose up -d api-server
echo "Rebuild complete. API server is running at http://localhost:3000/api"
echo "To process a PDF, run: docker compose up pdf-converter" 