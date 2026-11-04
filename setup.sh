#!/usr/bin/env bash
# Configure et démarre L'intranet. Peut être relancé sans risque : les secrets existants sont conservés.
set -euo pipefail
cd "$(dirname "$0")"

MODE=""
ASSUME_YES=false
START=true

usage() {
    cat <<USAGE
Usage : ./setup.sh [options]

  --dev        Mode développement (rechargement à chaud, phpMyAdmin)
  --prod       Mode production (par défaut)
  -y, --yes    Ne pose aucune question et utilise les valeurs par défaut
  --no-start   Génère la configuration sans démarrer l'application
  -h, --help   Affiche cette aide

Valeurs utilisables sans question : SERVER_NAME, ADMIN_EMAIL, HTTP_PORT, HTTPS_PORT
Exemple : SERVER_NAME=192.168.1.20 ./setup.sh -y
USAGE
}

while [ $# -gt 0 ]; do
    case "$1" in
        --dev) MODE=dev ;;
        --prod) MODE=prod ;;
        -y | --yes) ASSUME_YES=true ;;
        --no-start) START=false ;;
        -h | --help) usage; exit 0 ;;
        *) echo "Option inconnue : $1" >&2; usage >&2; exit 1 ;;
    esac
    shift
done

if ! docker compose version >/dev/null 2>&1; then
    echo "Docker Compose est introuvable. Installez Docker : https://docs.docker.com/get-docker/" >&2
    exit 1
fi

# Lit une valeur dans un fichier .env, sans jamais exécuter son contenu.
read_env() {
    [ -f "$1" ] || return 0
    sed -n "s/^$2=//p" "$1" | tail -n 1 | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

random_string() {
    LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c "$1" || true
}

ask() { # ask <question> <valeur par défaut>
    local answer=""
    if [ "$ASSUME_YES" = false ] && [ -t 0 ]; then
        read -r -p "$1 [$2] : " answer
    fi
    printf '%s' "${answer:-$2}"
}

is_empty_dir() {
    [ ! -d "$1" ] || { [ -r "$1" ] && [ -z "$(ls -A "$1")" ]; }
}

SERVER_NAME_VALUE="$(read_env .env SERVER_NAME)"
DB_ROOT_PASSWORD_VALUE="$(read_env .env DB_ROOT_PASSWORD)"
DB_USERNAME_VALUE="$(read_env .env DB_USERNAME)"
DB_PASSWORD_VALUE="$(read_env .env DB_PASSWORD)"
APP_KEY_VALUE="$(read_env .env APP_KEY)"
JWT_SECRET_VALUE="$(read_env .env JWT_SECRET)"
ADMIN_EMAIL_VALUE="$(read_env .env ADMIN_EMAIL)"
ADMIN_PASSWORD_VALUE="$(read_env .env ADMIN_PASSWORD)"
HTTP_PORT_VALUE="$(read_env .env HTTP_PORT)"
HTTPS_PORT_VALUE="$(read_env .env HTTPS_PORT)"

FIRST_INSTALL=false
is_empty_dir intranetDB_data && FIRST_INSTALL=true

if [ ! -f .env ] && [ "$FIRST_INSTALL" = false ]; then
    echo "intranetDB_data/ contient une base, mais .env est introuvable : ses mots de passe sont perdus." >&2
    echo "Restaurez votre .env, ou supprimez intranetDB_data/ pour repartir de zéro (données perdues)." >&2
    exit 1
fi

# Reprise d'une installation antérieure : tout était alors réparti entre plusieurs .env.
if [ -f .env ] && [ -z "$DB_ROOT_PASSWORD_VALUE" ]; then
    backup=".env.backup-$(date +%Y%m%d%H%M%S)"
    (umask 077; cp .env "$backup")
    echo "Ancienne configuration détectée, sauvegardée dans $backup."
    LEGACY_INSTALL=true

    if [ -z "$MODE" ] && [ "$(read_env .env NODE_ENV)" = "dev" ]; then
        MODE=dev
    fi
    [ -n "$APP_KEY_VALUE" ] || APP_KEY_VALUE="$(read_env intranet-backend/.env APP_KEY)"
    [ -n "$JWT_SECRET_VALUE" ] || JWT_SECRET_VALUE="$(read_env intranet-backend/.env JWT_SECRET)"

    if [ "$FIRST_INSTALL" = false ]; then
        # La base existe déjà : elle n'accepte que l'utilisateur root et son mot de passe actuel.
        DB_ROOT_PASSWORD_VALUE="$DB_PASSWORD_VALUE"
        DB_USERNAME_VALUE="root"
        LEGACY_DB_ROOT=true
    else
        DB_PASSWORD_VALUE=""
    fi
fi

if [ -z "$MODE" ]; then
    case "$(read_env .env COMPOSE_FILE)" in
        *docker-compose.dev.yml*) MODE=dev ;;
        *) MODE=prod ;;
    esac
fi

if [ -z "$SERVER_NAME_VALUE" ] || [ ! -f .env ]; then
    SERVER_NAME_VALUE="$(ask "Adresse de l'intranet : IP ou nom de domaine, sans https:// (plusieurs possibles, séparés par des espaces)" "${SERVER_NAME:-localhost}")"
else
    SERVER_NAME_VALUE="${SERVER_NAME:-$SERVER_NAME_VALUE}"
fi
SERVER_NAME_VALUE="$(printf '%s' "$SERVER_NAME_VALUE" | sed -E -e 's#https?://##g' -e 's#/##g')"

if [ "$FIRST_INSTALL" = true ] && [ -z "$ADMIN_PASSWORD_VALUE" ]; then
    ADMIN_EMAIL_VALUE="$(ask "E-mail du compte administrateur" "${ADMIN_EMAIL:-admin@example.com}")"
    ADMIN_PASSWORD_VALUE="$(random_string 20)"
fi

COMPOSE_FILES="docker-compose.yml"
[ "$MODE" = "dev" ] && COMPOSE_FILES="docker-compose.yml:docker-compose.dev.yml"

first_name="${SERVER_NAME_VALUE%% *}"
HTTP_PORT_VALUE="${HTTP_PORT:-${HTTP_PORT_VALUE:-80}}"
HTTPS_PORT_VALUE="${HTTPS_PORT:-${HTTPS_PORT_VALUE:-443}}"
[ "$HTTPS_PORT_VALUE" = "443" ] && APP_URL_VALUE="https://$first_name" || APP_URL_VALUE="https://$first_name:$HTTPS_PORT_VALUE"

umask 077
cat > .env <<ENV
# Généré par setup.sh. Ce fichier contient des secrets : ne le partagez pas et ne le committez pas.

# Docker Compose
COMPOSE_FILE=$COMPOSE_FILES
COMPOSE_PATH_SEPARATOR=:

# Réseau
SERVER_NAME="$SERVER_NAME_VALUE"
HTTP_PORT=$HTTP_PORT_VALUE
HTTPS_PORT=$HTTPS_PORT_VALUE
APP_URL=$APP_URL_VALUE

# Base de données
DB_ROOT_PASSWORD=${DB_ROOT_PASSWORD_VALUE:-$(random_string 32)}
DB_USERNAME=${DB_USERNAME_VALUE:-intranet}
DB_PASSWORD=${DB_PASSWORD_VALUE:-$(random_string 32)}

# Secrets de l'application : les changer déconnecte tous les utilisateurs.
APP_KEY=${APP_KEY_VALUE:-base64:$(head -c 32 /dev/urandom | base64)}
JWT_SECRET=${JWT_SECRET_VALUE:-$(random_string 64)}

# Compte créé au premier démarrage. Ce mot de passe provisoire doit être changé à la première connexion.
ADMIN_EMAIL=${ADMIN_EMAIL_VALUE:-admin@example.com}
ADMIN_PASSWORD=$ADMIN_PASSWORD_VALUE
ENV
umask 022

echo "Configuration écrite dans .env (mode : $MODE)."

mkdir -p ssl/certs

if [ "${LEGACY_DB_ROOT:-false}" = true ]; then
    echo
    echo "ATTENTION : la base existante reste accessible avec le compte root."
    echo "Consultez la section « Mettre à jour une ancienne installation » du readme.md pour la sécuriser."
fi

[ "$HTTPS_PORT_VALUE" = "443" ] && URL="https://$first_name" || URL="https://$first_name:$HTTPS_PORT_VALUE"

if [ "$START" = true ]; then
    if [ "${LEGACY_INSTALL:-false}" = true ]; then
        # Les noms de réseau et de conteneurs ont changé : Compose ne sait pas les remplacer à chaud.
        docker compose down --remove-orphans
        docker network rm intra-net >/dev/null 2>&1 || true
    fi
    echo "Construction et démarrage (quelques minutes la première fois)..."
    if ! docker compose up -d --build --wait; then
        echo
        echo "Le démarrage a échoué. Pour voir pourquoi : docker compose logs --tail=50" >&2
        exit 1
    fi
    echo
    echo "L'intranet est prêt : $URL"
else
    echo
    echo "Pour démarrer : docker compose up -d --build"
    echo "Adresse : $URL"
fi

if [ "$FIRST_INSTALL" = true ]; then
    echo
    echo "Première connexion :"
    echo "  E-mail       : ${ADMIN_EMAIL_VALUE:-admin@example.com}"
    echo "  Mot de passe : $ADMIN_PASSWORD_VALUE"
    echo "Ce mot de passe est provisoire : il vous sera demandé d'en choisir un autre."
    echo "Le certificat est auto-signé : votre navigateur affichera un avertissement à accepter."
fi
