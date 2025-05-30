#!/bin/bash

# Create necessary directories
mkdir -p backend/uploads/bouquets backend/uploads/categories

# Generate password hash for admin
cd backend
node scripts/generate-password-hash.js > admin_password_hash.txt
cd ..

# Start the application
docker-compose up --build 