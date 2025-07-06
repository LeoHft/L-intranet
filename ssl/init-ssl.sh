#!/bin/sh
set -e


echo 'Vérification des certificats SSL...'
mkdir -p ./
chmod 755 ./

if [ -f ./certificate.crt ] && [ -f ./private.key ]; then
  echo 'Certificats SSL trouvés!'
  # Vérifier les permissions
  chmod 644 ./certificate.crt ./private.key
  exit 0
fi

echo 'Génération des certificats SSL manquants...'

cat > ./openssl.conf << 'EOF'
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
DNS.4 = breezy.local
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

openssl genrsa -out ./private.key 2048
openssl req -new -x509 -key ./private.key -out ./certificate.crt -days 365 -config ./openssl.conf -extensions v3_req

chmod 644 ./private.key
chmod 644 ./certificate.crt

echo 'Certificats générés !'
