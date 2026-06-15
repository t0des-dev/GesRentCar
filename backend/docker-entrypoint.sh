#!/bin/sh
set -e

# Wait for database to be ready (optional but recommended)
# sleep 5

if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate --force
fi

# Run migrations
php artisan migrate --force

# Fix permissions for the mounted volume
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Optimize Laravel for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM
exec php-fpm
