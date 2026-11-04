# L'intranet : Votre Dashboard pour l'Auto-Hébergement

## Pourquoi utiliser L'intranet  ?

Vous hébergez plusieurs services chez vous (Homelab) ? Vous en avez assez de gérer des dizaines de favoris ou de retenir des ports IP différents ?
**L'intranet** transforme votre expérience serveur en regroupant l'accès à toutes vos applications via un tableau de bord moderne, fluide et animé.


<img width="1693" height="1254" alt="homepage" src="https://github.com/user-attachments/assets/48feea93-9ca4-4162-bf7e-af31e243f5ec" />

---

## Fonctionnalités Clés

### Pour l'Administrateur (Contrôle Total)
* **Gestion fine des accès (RBAC) :** Créez des utilisateurs et définissez précisément les services auxquels ils ont accès.
* **Configuration avancée des services :**
    * Ajout de liens locaux (LAN) et externes (WAN).
    * Personnalisation complète : Descriptions, images, catégories et statuts.
* **Analytique intégrée :** Suivez l'utilisation de vos services avec des statistiques détaillées par utilisateur, par lien et par date.

### Pour l'Utilisateur (Expérience Fluide)
* **Interface Moderne :** Une UI épurée intégrant des animations soignées pour une navigation agréable.
* **Accès Personnalisé :** Ne voyez que les services auxquels vous avez un droit d'accès.
* **Productivité Boostée :** Chaque utilisateur peut configurer jusqu'à **10 raccourcis rapides** (avec émojis personnalisés) pour accéder instantanément à ses sites favoris.

---

# Quelques photos :

## Ajoutez vos propres raccourcis
<img width="1697" height="1256" alt="welcome" src="https://github.com/user-attachments/assets/bdffcc52-b502-4840-8cdc-f023fdbc6c66" />

## Accédez à vos services rapidement
<img width="1693" height="1254" alt="homepage" src="https://github.com/user-attachments/assets/48feea93-9ca4-4162-bf7e-af31e243f5ec" />

## Managez vos services et attribuez leurs plusieurs paramètres
<img width="1698" height="1257" alt="services" src="https://github.com/user-attachments/assets/b0638da4-cf87-45f8-97bc-ddefaeeb2776" />

## Créez autant de catégories et status dont vous avez besoin
<img width="1694" height="378" alt="status" src="https://github.com/user-attachments/assets/74f05ffa-cf07-4ce6-988b-09ec709cb401" />
<img width="1695" height="377" alt="categorys" src="https://github.com/user-attachments/assets/7f080725-4989-4bab-9de2-9e8bb2364871" />

## Ajoutez autant d'utilisateurs que voulu et listez rapidement leurs accès
<img width="1699" height="498" alt="users (2)" src="https://github.com/user-attachments/assets/91e90d08-f290-4906-9e64-b9cb05597ed8" />

## Modifiez vos informations à tout moment
<img width="1700" height="982" alt="user" src="https://github.com/user-attachments/assets/8918169c-5dfb-4a4d-b4c0-2cbf1f1bdc94" />

---

## 🛠️ Installation

Il vous faut [Docker](https://docs.docker.com/get-docker/) avec Docker Compose. Sous Windows, lancez les commandes depuis WSL ou Git Bash.

```sh
git clone https://github.com/LeoHft/L-intranet.git
cd L-intranet
./setup.sh
```

Le script vous demande l'adresse de l'intranet et un e-mail d'administrateur, génère tous les secrets, puis démarre l'application. À la fin, il affiche l'adresse à ouvrir et un mot de passe provisoire.

À la première connexion, l'application vous demande de choisir votre propre mot de passe (12 caractères minimum). Votre navigateur affichera un avertissement, car le certificat est auto-signé : acceptez-le, ou [utilisez votre propre certificat](#utiliser-votre-propre-certificat).

Pour une installation sans question :

```sh
SERVER_NAME=192.168.1.20 ADMIN_EMAIL=moi@example.com ./setup.sh -y
```

Si les ports 80 ou 443 sont déjà pris, ajoutez par exemple `HTTP_PORT=8088 HTTPS_PORT=8443` devant la commande.

---

## Configuration

Toute la configuration tient dans le fichier `.env` à la racine, généré par `setup.sh`. Ne le partagez pas : il contient vos secrets. Après une modification, appliquez-la avec `docker compose up -d`.

| Variable | Rôle |
| --- | --- |
| `SERVER_NAME` | IP ou nom de domaine, sans `https://`. Plusieurs valeurs possibles, séparées par des espaces et entre guillemets. |
| `HTTP_PORT`, `HTTPS_PORT` | Ports exposés sur la machine hôte. |
| `JWT_TTL` | Durée d'une session, en minutes (2 semaines si absent). |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Compte créé au tout premier démarrage. Ce mot de passe ne sert plus après la première connexion. |

### Utiliser votre propre certificat

Déposez `certificate.crt` et `private.key` dans `ssl/certs/`, supprimez `ssl/certs/.self-signed-for`, puis lancez `docker compose restart nginx`. Votre certificat ne sera jamais remplacé.

Le certificat auto-signé est régénéré automatiquement si `SERVER_NAME` change.

---

## Utilisation au quotidien

| Besoin | Commande |
| --- | --- |
| Voir les journaux | `docker compose logs -f` |
| Arrêter | `docker compose down` |
| Mettre à jour | `git pull && docker compose up -d --build` |
| Réinitialiser un mot de passe perdu | `docker compose exec intranet-backend php artisan intranet:reset-password moi@example.com` |

Un administrateur peut aussi réinitialiser le mot de passe d'un utilisateur depuis l'onglet **Utilisateurs**.

**À sauvegarder :** le fichier `.env`, le dossier `intranetDB_data/` (la base de données) et `intranet-backend/storage/app/public/` (les images).

---

## Mettre à jour une ancienne installation

Si votre installation utilise encore `env/.env.prod` et plusieurs fichiers `.env`, lancez :

```sh
git pull
./setup.sh
```

Le script sauvegarde votre ancien `.env`, reprend vos réglages et conserve vos données. Les fichiers `intranet-backend/.env` et `intranet-frontend/.env` ne servent plus et peuvent être supprimés. La migration oblige l'administrateur par défaut à changer son mot de passe s'il utilisait encore `password`, ainsi que les comptes jamais utilisés.

Votre base continue alors à utiliser le compte `root`, avec le mot de passe de l'ancien fichier. **Si c'était le mot de passe par défaut du dépôt, changez-le.** Pour passer à un compte dédié, ouvrez une console avec `docker compose exec intranetDB mariadb -uroot -p`, puis exécutez :

```sql
CREATE USER 'intranet'@'%' IDENTIFIED BY 'mot-de-passe-applicatif';
GRANT ALL PRIVILEGES ON intranet.* TO 'intranet'@'%';
ALTER USER 'root'@'%' IDENTIFIED BY 'nouveau-mot-de-passe-root';
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nouveau-mot-de-passe-root';
```

Reportez ensuite ces valeurs dans `.env` (`DB_USERNAME=intranet`, `DB_PASSWORD`, `DB_ROOT_PASSWORD`) et lancez `docker compose up -d`.

---

## Développement

```sh
./setup.sh --dev
```

Ce mode monte le code depuis votre machine, active le rechargement à chaud de Vite et ajoute phpMyAdmin sur <http://127.0.0.1:8080> et la base sur `127.0.0.1:3307`. Ne l'utilisez pas en production : phpMyAdmin s'y connecte automatiquement en root. `./setup.sh --prod` revient au mode production.

```sh
docker compose exec intranet-backend php artisan test    # Tests du backend
docker compose exec intranet-frontend npm run lint       # Lint du frontend
```

---

## Sécurité

- **Exposition :** seuls les ports 80 et 443 sont ouverts en production. Pour un accès depuis Internet, préférez un VPN, ou placez l'intranet derrière un reverse proxy avec un vrai certificat.
- **Comptes :** les mots de passe provisoires doivent être changés avant tout accès. Changer un mot de passe déconnecte toutes les sessions du compte. Les tentatives de connexion sont limitées à 5 par minute.
- **Recherche :** la barre de recherche de l'interface envoie vos requêtes à Google.
