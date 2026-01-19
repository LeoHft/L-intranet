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

## 🛠️ Installation & Configuration étape par étape
/!\ Vous avez besoin de docker compose installé.

1) ```sh 
    git clone https://github.com/LeoHft/L-intranet.git
    ```

2) ```sh
    cd ./L-intranet/
    ```

3) ```sh
    cp ./env/.env.prod .env
    ```

4) ```sh
    vi .env 
    ```
    Et modifiez la variable `SERVER_NAME` et `DB_PASSWORD`. Suivez les instructions `#TODO` pour plus d'explications.

5) ```sh
    cp intranet-backend/.env.example ./intranet-backend/.env
    ```

6) ```sh
    vi intranet-backend/.env
    ```
    Et modifiez la variable `APP_URL` et `DB_PASSWORD`. Suivez les instruction `#TODO` pour plus d'explications.

7) ```sh
    cp ./intranet-frontend/.env.example ./intranet-frontend/.env
    ```

8) ```sh
    vi ./intranet-frontend/.env
    ```
    Et modifiez la variable `VITE_API_URL`. Suivez l'instruction `#TODO` pour plus d'explications. 

9) ```sh
    docker compose up --build -d
    ```

10) Une fois l'application construite, accédez à l'application par l'IP / nom de domaine que vous avez noté dans le .env de l'étape `4` par exemple `https://192.168.15.12` ou `https://intranet.com` (attention à mettre seulement l'IP / nom de domaine dans l'étpae `4` et non pas l'url entière).

11) Une fois que vous accédez à l'application, connectez vous avec `admin@example.com` et `password`, un formulaire s'ouvrira pour modifier les informations de l'utilisateur admin (nom, mail, mot de passe).

12) Vous êtes prêt à utiliser l'application.


