FROM alpine/openssl

RUN apk update && apk add dos2unix

COPY init-ssl.sh /init-ssl.sh

RUN dos2unix init-ssl.sh # Converti le fichier de script du format windows à unix

RUN chmod +x /init-ssl.sh

ENTRYPOINT ["/bin/sh", "/init-ssl.sh"]
