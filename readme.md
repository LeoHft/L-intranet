# L'intranet : Votre Dashboard pour l'Auto-Hébergement

## Pourquoi utiliser L'intranet  ?

Vous hébergez plusieurs services chez vous (Homelab) ? Vous en avez assez de gérer des dizaines de favoris ou de retenir des ports IP différents ?
**L'intranet** transforme votre expérience serveur en regroupant l'accès à toutes vos applications via un tableau de bord moderne, fluide et animé.



---

## Fonctionnalités Clés

### Pour l'Administrateur (Contrôle Total)
* **Gestion fine des accès (RBAC) :** Créez des utilisateurs et définissez précisément quels services ils peuvent voir ou utiliser.
* **Configuration avancée des services :**
    * Ajout de liens locaux (LAN) et externes (WAN).
    * Personnalisation complète : Descriptions, images, catégories et statuts.
* **Analytique intégrée :** Suivez l'utilisation de vos services avec des statistiques détaillées par utilisateur, par lien et par date.

### Pour l'Utilisateur (Expérience Fluide)
* **Interface Moderne :** Une UI épurée intégrant des animations soignées pour une navigation agréable.
* **Accès Personnalisé :** Ne voyez que les services auxquels vous avez un droit d'accès.
* **Productivité Boostée :** Chaque utilisateur peut configurer jusqu'à **10 raccourcis rapides** (avec émojis personnalisés) pour accéder instantanément à ses sites favoris.

---

## 🛠️ Installation & Configuration étape par étape
/!\ Vous avez besoin de docker compose installé.

1) ```sh 
    git clone https://github.com/LeoHft/L-intranet.git
    ```

2) ```sh
    cd ./L-intranet/
    ```

3) ```sh
    sudo chmod +x ./nginx/docker-entrypoint.sh
    ```

4) ```sh
    sudo chmod +x ./intranet-backend/entrypoint.sh
    ```

5) ```sh
    cp ./env/.env.prod .env
    ```

6) ```sh
    vi .env 
    ```
    Et modifiez la variable `SERVER_NAME` et `DB_PASSWORD` tel que noté dans les lignes au dessus `TODO`

7) ```sh
    cp intranet-backend/.env.example ./intranet-backend/.env
    ```

8) ```sh
    vi intranet-backend/.env
    ```
    Et modifiez la variable `APP_URL` et `DB_PASSWORD` par le même password que vous avez noté dans le .env étape `6`

9) ```sh
    cp ./intranet-frontend/.env.example ./intranet-frontend/.env
    ```

10) ```sh
    vi ./intranet-frontend/.env
    ```
    Et modifiez la variable `VITE_API_URL` tel que noté dans la ligne au dessus `TODO`

11) ```sh
    docker compose up --build -d
    ```

12) Une fois l'application construite, accédez à l'application par l'IP / nom de domaine que vous avez noté dans le .env de l'étape `6` par exemple `https://192.168.15.12` ou `https://intranet.com` (attention à mettre seulement l'IP / nom de domaine dans l'étpae `6` et non pas l'url entière).

13) Une fois que vous accédez à l'application, connectez vous avec `admin@example.com` et `password`, un formulaire s'ouvrira pour modifier les informations de l'utilisateur admin (nom, mail, mot de passe).

14) Vous êtes prêt à utiliser l'application.

# Quelques photos :

