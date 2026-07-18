#!/bin/sh

# Wait for database to be ready
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

# Run migrations (never abort on failure)
php artisan migrate --force || echo "WARNING: Migration failed, continuing anyway..."

# Fix permissions for the mounted volume
if [ "$(id -u)" = "0" ]; then
    chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache || true
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache || true
fi

# Publish and cache Filament admin assets
php artisan filament:assets --ansi --no-interaction 2>/dev/null || true
php artisan storage:link 2>/dev/null || true

# Optimize Laravel for production
php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true
php artisan view:cache 2>/dev/null || true

# Pass CMD arguments if provided (docker-compose command:), otherwise start PHP-FPM
if [ $# -gt 0 ]; then
    exec "$@"
else
    exec php-fpm
fi
