# ─── Base stage: worker & scheduler (no Tesseract) ─────────────────────────
FROM php:8.4-fpm AS base

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
    postgresql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) pdo_pgsql mbstring exif pcntl bcmath gd intl zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*.deb /var/cache/apt/archives/partial/* /tmp/* /var/tmp/*

RUN echo "upload_max_filesize = 10M" > /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size = 12M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "max_execution_time = 120" >> /usr/local/etc/php/conf.d/uploads.ini

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
COPY --chown=www-data:www-data . /var/www
RUN rm -f bootstrap/cache/*.php \
    && rm -rf /root/.config/composer /tmp/composer-cache \
    && COMPOSER_CACHE_DIR=/tmp/composer-cache composer install \
        --no-interaction --optimize-autoloader --no-dev --ignore-platform-reqs --no-scripts --prefer-source \
    && find vendor -type d -name ".git" -exec rm -rf {} \; 2>/dev/null || true \
    && php artisan vendor:publish --tag=laravel-assets --ansi --force 2>/dev/null || true \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ─── Backend stage: API + OCR (with Tesseract) ────────────────────────────
FROM base AS backend

RUN rm -rf /var/cache/apt/archives/*.deb /var/cache/apt/archives/partial/* /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        tesseract-ocr \
        tesseract-ocr-fra \
        tesseract-ocr-eng \
        tesseract-ocr-ara \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*.deb /var/cache/apt/archives/partial/* /tmp/* /var/tmp/*

EXPOSE 9000
ENTRYPOINT ["docker-entrypoint.sh"]
