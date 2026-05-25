#!/bin/sh

echo "Running production deploy tasks..."

# Cache configuration, routes, and views
echo "Caching Laravel assets..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
echo "Running database migrations..."
php artisan migrate --force
