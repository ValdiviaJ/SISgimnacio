FROM php:8.2-cli-alpine

# Install system dependencies and PostgreSQL PHP extensions
RUN apk add --no-cache libpq-dev zip unzip git \
    && docker-php-ext-install pdo_pgsql pgsql

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html

EXPOSE 8000
EXPOSE 8080
