FROM phpmyadmin:latest

RUN apt-get update && apt-get install -y unzip && apt-get install -y wget

WORKDIR /var/www/html/themes

RUN wget https://files.phpmyadmin.net/themes/blueberry/1.1.0/blueberry-1.1.0.zip

RUN unzip blueberry-1.1.0.zip && \
    rm blueberry-1.1.0.zip