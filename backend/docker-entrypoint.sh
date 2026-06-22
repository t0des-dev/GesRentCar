#!/bin/sh
set -e

# Wait for database to be ready (using pg_isready if pgsql is used)
if [ "$DB_CONNECTION" = "pgsql" ]; then
    echo "Waiting for PostgreSQL database at $DB_HOST:$DB_PORT..."
    until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
        echo "Database is not ready yet, retrying in 2 seconds..."
        sleep 2
    done
    echo "PostgreSQL is ready!"
fi

if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate --force
fi

# Run migrations
php artisan migrate --force

# Fix permissions for the mounted volume (only if running as root)
if [ "$(id -u)" = "0" ]; then
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache || true
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache || true
else
    echo "Running as non-root user, skipping ownership/permission changes."
fi

# Optimize Laravel for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start PHP-FPM
exec php-fpm
