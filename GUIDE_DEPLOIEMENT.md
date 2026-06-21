# Guide de Déploiement - Vectoria Rent Car

Ce guide détaille les étapes nécessaires pour déployer l'application **Vectoria Rent Car** en environnement de production en utilisant Docker et Docker Compose.

## Prérequis

Avant de commencer, assurez-vous de disposer d'un serveur (VPS ou Cloud) avec les éléments suivants installés :

- **Git** (pour récupérer le code)
- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version V2)

## Étape 1 : Récupérer le code source

Connectez-vous à votre serveur de production via SSH et clonez le dépôt :

```bash
git clone https://github.com/t0des-dev/VectoriaRentCar.git
cd VectoriaRentCar
```

## Étape 2 : Configuration des variables d'environnement

### Backend
Copiez le fichier d'exemple et configurez les variables d'environnement pour Laravel :

```bash
cd backend
cp .env.example .env
```
Ouvrez le fichier `.env` et assurez-vous que la configuration de la base de données et de Redis correspond à `docker-compose.prod.yml` :
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://votre-nom-de-domaine.com

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=vectoria
DB_USERNAME=admin
DB_PASSWORD=secret

REDIS_HOST=redis
QUEUE_CONNECTION=redis
```

### Frontend
Configurez les variables pour Next.js (si besoin) :

```bash
cd ../frontend
cp .env.example .env.local
```
Ouvrez `.env.local` et modifiez `NEXT_PUBLIC_API_URL` avec votre nom de domaine de production, ainsi que vos clés Stripe et autres :
```env
NEXT_PUBLIC_API_URL=http://votre-nom-de-domaine.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_stripe
```
*(Attention : L'application React/Next.js ayant été conçue pour intégrer les variables à la construction, toute modification de ces variables nécessitera de reconstruire l'image Docker du frontend.)*

## Étape 3 : Lancer l'infrastructure avec Docker

Revenez à la racine du projet et lancez les conteneurs avec le fichier de production :

```bash
cd ..
docker compose -f docker-compose.prod.yml up -d --build
```

Cela va construire et démarrer les conteneurs suivants :
- `gesrentcar-backend` (API PHP-FPM)
- `gesrentcar-worker` (Traitement asynchrone / queues)
- `gesrentcar-frontend` (Next.js en mode standalone)
- `gesrentcar-web` (Nginx, servant de reverse-proxy sur le port `8080`)
- `gesrentcar-db` (Base de données PostgreSQL)
- `gesrentcar-redis` (Cache et files d'attente Redis)

## Étape 4 : Initialiser l'application

Une fois les conteneurs démarrés, vous devez générer la clé d'application Laravel, exécuter les migrations de base de données et publier les liens de stockage :

```bash
# Générer la clé d'application
docker exec -it gesrentcar-backend php artisan key:generate

# Lancer les migrations et les seeders (si vous avez des données de test)
docker exec -it gesrentcar-backend php artisan db:seed --force

# Créer le lien symbolique pour les fichiers publics (images de véhicules, contrats, etc.)
docker exec -it gesrentcar-backend php artisan storage:link
```

## Étape 5 : Exposer l'application (Reverse Proxy SSL)

Actuellement, l'application est exposée sur le port `8080` de votre serveur. Pour un déploiement en production, il est fortement recommandé d'utiliser un serveur web (Nginx, Apache ou Caddy) directement sur votre machine hôte (ou via un outil comme Traefik) pour gérer les certificats SSL (HTTPS).

**Exemple de configuration Nginx sur la machine hôte :**

```nginx
server {
    listen 80;
    server_name votre-nom-de-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Vous pouvez ensuite sécuriser ce domaine avec Certbot (Let's Encrypt) :
```bash
sudo certbot --nginx -d votre-nom-de-domaine.com
```

## Mise à jour (CI/CD ou manuelle)

Pour mettre à jour votre application vers une nouvelle version :

```bash
# 1. Récupérer les dernières modifications
git pull origin main

# 2. Reconstruire et redémarrer les conteneurs impactés
docker compose -f docker-compose.prod.yml up -d --build

# 3. Exécuter les migrations si nécessaire
docker exec -it gesrentcar-backend php artisan migrate --force
```

## Résolution des problèmes fréquents

- **Erreur de permission de stockage** : Assurez-vous que les dossiers `/storage` et `/bootstrap/cache` du backend ont les bonnes permissions (bien que Docker le gère souvent nativement).
- **Frontend ne communique pas avec l'API** : Vérifiez que la variable `NEXT_PUBLIC_API_URL` a bien été injectée au moment du `build` de l'image du frontend.
- **Images non visibles** : Avez-vous exécuté la commande `storage:link` mentionnée à l'Étape 4 ?
