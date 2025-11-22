#!/bin/sh
set -e

SSL_DIR="/ssl"

echo 'Vérification des certificats SSL...'
mkdir -p ${SSL_DIR}
chmod 755 ${SSL_DIR}

if [ -f ${SSL_DIR}/certificate.crt ] && [ -f ${SSL_DIR}/private.key ]; then
  echo 'Certificats SSL trouvés!'
  # Vérifier les permissions
  chmod 644 ${SSL_DIR}/certificate.crt ${SSL_DIR}/private.key
  exit 0
fi

echo 'Génération des certificats SSL manquants...'

cat > ${SSL_DIR}/openssl.conf << 'EOF'
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=FR
ST=Grand Est
L=Strasbourg
O=intranet
OU=IT Department
CN=localhost

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = www.localhost
DNS.3 = 127.0.0.1
DNS.4 = intranet.local
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

openssl genrsa -out ${SSL_DIR}/private.key 2048
openssl req -new -x509 -key ${SSL_DIR}/private.key -out ${SSL_DIR}/certificate.crt -days 3650 -config ${SSL_DIR}/openssl.conf -extensions v3_req

chmod 644 ${SSL_DIR}/private.key
chmod 644 ${SSL_DIR}/certificate.crt

echo 'Certificats générés dans ${SSL_DIR}!'
