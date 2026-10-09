FROM php:8.4-cli

RUN apt-get update && apt-get install -y git unzip curl libpq-dev libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build && rm -rf node_modules

COPY docker/php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

CMD php artisan storage:link ; php artisan migrate --force && php -d upload_max_filesize=20M -d post_max_size=25M artisan serve --host=0.0.0.0 --port=${PORT:-10000}