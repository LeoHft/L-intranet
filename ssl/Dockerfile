FROM alpine/openssl

COPY init-ssl.sh /init-ssl.sh
COPY openssl.conf /openssl.conf

ENTRYPOINT ["/bin/sh", "/init-ssl.sh"]
