FROM php:8.2-fpm
# Définir le répertoire de travail
WORKDIR /var/www/html

COPY . .

RUN chmod -R 775 /var/www/html/storage && \
    chmod -R 775 /var/www/html/bootstrap/cache

# Installation des dépendances système et PHP
RUN apt-get update \
  && apt-get install -y build-essential libpng-dev libjpeg-dev libonig-dev \
     libxml2-dev libzip-dev pkg-config zip unzip curl gnupg netcat-openbsd \
     libicu-dev

# Installation de composer
RUN curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer \
  && docker-php-ext-configure intl \
  && docker-php-ext-install intl mbstring dom gd zip bcmath opcache pdo \
  && docker-php-ext-install mysqli pdo_mysql \
  && apt-get -y autoremove  \
  && apt-get clean  \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Configurer l'entrypoint
RUN sed -i 's/\r$//' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
