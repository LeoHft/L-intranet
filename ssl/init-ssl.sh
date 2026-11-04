#!/bin/sh
# Génère un certificat auto-signé couvrant SERVER_NAME.
# Un certificat que vous avez déposé vous-même dans ssl/certs/ n'est jamais remplacé.
set -eu

CERT=/ssl/certificate.crt
KEY=/ssl/private.key
MARKER=/ssl/.self-signed-for
NAMES="${SERVER_NAME:-localhost}"

if [ -f "$CERT" ] && [ -f "$KEY" ]; then
    if [ ! -f "$MARKER" ]; then
        echo "Certificat personnel détecté : conservé."
        exit 0
    fi
    if [ "$(cat "$MARKER")" = "$NAMES" ]; then
        echo "Certificat auto-signé à jour."
        exit 0
    fi
    echo "SERVER_NAME a changé : régénération du certificat auto-signé."
fi

SAN="DNS:localhost,IP:127.0.0.1,IP:::1"
FIRST=""
for name in $NAMES; do
    [ -n "$FIRST" ] || FIRST="$name"
    case "$name" in
        localhost | 127.0.0.1 | ::1) ;;
        *:*) SAN="$SAN,IP:$name" ;;
        *[!0-9.]*) SAN="$SAN,DNS:$name" ;;
        *) SAN="$SAN,IP:$name" ;;
    esac
done

openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 3650 \
    -keyout "$KEY" -out "$CERT" \
    -subj "/O=L'intranet/CN=$FIRST" \
    -addext "subjectAltName=$SAN" \
    -addext "basicConstraints=critical,CA:FALSE" \
    -addext "keyUsage=critical,digitalSignature,keyEncipherment" \
    -addext "extendedKeyUsage=serverAuth"

chmod 600 "$KEY"
chmod 644 "$CERT"
printf '%s' "$NAMES" > "$MARKER"

echo "Certificat auto-signé généré pour : $NAMES"
