# ─── Base stage: PHP + system deps ─────────────────────────────────────────
FROM php:8.4-fpm AS base

# Clean first to free builder disk space
RUN rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    libzip-dev \
    libicu-dev \
    libjpeg-dev \
    libwebp-dev \
    libfreetype6-dev \
    cron \
    procps \
    default-mysql-client \
    tesseract-ocr \
    tesseract-ocr-fra \
    tesseract-ocr-eng \
    tesseract-ocr-ara \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd intl zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*

RUN echo "upload_max_filesize = 10M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 12M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time = 120" >> /usr/local/etc/php/conf.d/uploads.ini

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
COPY --chown=www-data:www-data . /var/www
RUN rm -f bootstrap/cache/*.php \
    && rm -rf /root/.config/composer \
    && composer install \
        --no-interaction --optimize-autoloader --no-dev --ignore-platform-reqs --no-scripts \
    && rm -rf /tmp/* /root/.composer/cache \
    && find vendor -type d -name ".git" -exec rm -rf {} + 2>/dev/null || true \
    && php artisan vendor:publish --tag=laravel-assets --ansi --force 2>/dev/null || true \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ─── Backend stage: API + OCR ──────────────────────────────────────────────
FROM base AS backend
EXPOSE 9000
ENTRYPOINT ["docker-entrypoint.sh"]

# ─── Worker stage ───────────────────────────────────────────────────────────
FROM base AS worker
CMD ["php", "artisan", "queue:work", "--sleep=3", "--tries=3", "--max-time=3600"]

# ─── Scheduler stage ────────────────────────────────────────────────────────
FROM base AS scheduler
CMD ["php", "artisan", "schedule:work"]
