#!/bin/sh
set -e

# Wait for database to be ready (optional but recommended)
# sleep 5

# Run migrations
php artisan migrate --force

# Optimize Laravel for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM
exec php-fpm
