# 🚗 Vectoria Rent Car - Premium ERP & B2C Platform

**Vectoria Rent Car** est une plateforme SaaS complète (ERP B2B + Portail B2C) de location de véhicules haut de gamme. Elle est construite avec une architecture moderne séparant le frontend B2C/Dashboard et le backend ERP/Admin Panel.

![Vectoria Architecture](https://img.shields.io/badge/Architecture-DDD-purple.svg)
![Frontend](https://img.shields.io/badge/Frontend-Next.js_14-black.svg)
![Backend](https://img.shields.io/badge/Backend-Laravel_11-red.svg)
![Admin](https://img.shields.io/badge/Admin-Filament_v3-yellow.svg)

---

## 🎯 Fonctionnalités Principales

### 🖥️ Portail Client (Frontend - Next.js)
- **UI/UX Premium** : Design "Glassmorphism" moderne, animations fluides, responsive design (Tailwind CSS).
- **Découverte de Flotte** : Recherche en temps réel, filtres avancés (Prix, Type, Transmission).
- **Tunnel de Réservation** : Processus de location multi-étapes avec validation en temps réel.
- **Tableau de Bord Client** : Suivi des réservations actives, historiques, contrats et paiements.
- **Authentification Sécurisée** : Connexion/Inscription protégées via Laravel Sanctum.
- **State Management** : Gestion asynchrone des données et du cache via TanStack React Query.

### ⚙️ ERP & Admin Panel (Backend - Laravel)
- **Architecture DDD** : Logique métier encapsulée dans des Services (`AvailabilityEngine`, `PricingService`, etc.).
- **Gestion de la Flotte** : Ajout, modification, retrait des véhicules, et gestion du statut de maintenance via Filament.
- **Gestion des Réservations** : Suivi du cycle de vie complet (En attente, Confirmé, Terminé, Annulé).
- **API RESTful** : Endpoints documentés et sécurisés pour la communication avec le frontend.

---

## 🏗️ Architecture Technique

Le projet est divisé en deux répertoires principaux :

*   `/frontend` : Application Next.js (App Router), React, Tailwind CSS, Axios, React Query.
*   `/backend` : Application Laravel 11, Filament Admin Panel, SQLite (par défaut) / PostgreSQL.

---

## 🚀 Guide d'Installation (Environnement Local Windows)

Si vous êtes sur Windows et que vous ne souhaitez pas utiliser Docker, vous pouvez faire tourner le projet nativement grâce à SQLite.

### 1️⃣ Prérequis
*   **PHP >= 8.2** avec les extensions suivantes activées dans votre `php.ini` : `intl`, `zip`, `pcntl`, `pdo_sqlite`.
*   **Composer** installé globalement.
*   **Node.js** (v18+) et npm.

### 2️⃣ Configuration du Backend (Laravel)
Ouvrez un terminal dans le dossier `/backend` :

```bash
# 1. Installer les dépendances PHP (ignore platform reqs si nécessaire)
composer install --ignore-platform-reqs

# 2. Copier le fichier d'environnement et générer la clé de sécurité
cp .env.example .env
php artisan key:generate

# 3. Créer la base de données SQLite (si elle n'existe pas)
touch database/database.sqlite

# 4. Lancer les migrations et remplir la base avec des données de test
php artisan migrate --seed

# 5. Lancer le serveur de développement Laravel (Sera accessible sur http://localhost:8000)
php artisan serve
```
*L'Admin Panel sera accessible sur : `http://localhost:8000/admin`*

### 3️⃣ Configuration du Frontend (Next.js)
Ouvrez un **nouveau terminal** dans le dossier `/frontend` :

```bash
# 1. Installer les dépendances JavaScript
npm install

# 2. Configurer les variables d'environnement
# Créer un fichier .env.local contenant :
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 3. Lancer le serveur de développement Next.js
npm run dev
```
*Le portail client sera accessible sur : `http://localhost:3000`*

---

## 🐳 Guide de Déploiement & Installation (Avec Docker)

Si vous possédez **Docker**, le projet inclut un fichier `docker-compose.prod.yml` pré-configuré pour un environnement de production robuste (incluant Nginx, PostgreSQL et Redis).

À la racine du projet (`/VectoriaRentCar`) :

```bash
# 1. Construire et lancer les conteneurs en arrière-plan
docker compose -f docker-compose.prod.yml up -d --build

# 2. Lancer les migrations dans le conteneur backend (La db et la clé sont générées automatiquement)
docker compose -f docker-compose.prod.yml exec backend php artisan migrate --seed
```

### 🔄 Mise à jour en Production
En cas de nouvelle mise à jour sur le dépôt GitHub, exécutez ces commandes sur votre serveur :

```bash
# 1. Récupérez les dernières modifications
git pull origin main

# 2. Reconstruisez le frontend (et backend si nécessaire)
docker compose -f docker-compose.prod.yml build frontend backend

# 3. Relancez tous les conteneurs (Nginx prendra en compte la nouvelle conf)
docker compose -f docker-compose.prod.yml up -d
```

---

## 🔑 Accès Administrateur & Client (Comptes de Démo)

Une fois les *seeders* exécutés, vous pouvez utiliser ces comptes par défaut :

**Admin Panel B2B (Accessible sur le port 8080 : `http://VOTRE_IP:8080/admin`) :**
*   **Email** : `admin@vectoria.com`
*   **Mot de passe** : `Admin2026!`

**Portail Client B2C (Accessible sur le port 8080 : `http://VOTRE_IP:8080/`) :**
*   **Email** : `client@vectoria.com`
*   **Mot de passe** : `Client2026!`

---

## 📁 Structure des Dossiers Importants

### Frontend
- `src/app/` : Routes Next.js (page principale, fleet, booking, dashboard, login).
- `src/components/` : Composants UI réutilisables (VehicleCard, Navbar, FleetFilters).
- `src/lib/api/` : Services Axios (client, auth, vehicles, reservations).
- `src/hooks/` : Hooks React Query (`useApi.ts`).

### Backend
- `app/Filament/Resources/` : Interfaces d'administration générées (VehicleResource, ReservationResource).
- `app/Http/Controllers/Api/` : Contrôleurs REST (VehicleController, ReservationController).
- `app/Models/` : Entités de base de données (Vehicle, Reservation, User).
- `routes/api.php` : Définition des endpoints.

---

*Développé dans le cadre de la construction de l'écosystème ERP Premium Vectoria.*

---

## ❄️ Mises à jour Récentes (Arctic Luxury Transformation)

La plateforme a subi une modernisation majeure pour atteindre un standard de luxe international.

### 🎨 Design & Expérience Utilisateur
- **Experience Section** : Nouvelle section immersive sur la page d'accueil utilisant des animations `framer-motion` complexes et une typographie cinématographique.
- **Lifestyle Integration** : Intégration de 4 univers (Business Elite, Grand Tourisme, Wild Adventure, Family First) avec des images haute définition générées par IA.
- **Vibe Selector** : Système de filtrage émotionnel permettant de choisir un véhicule en fonction de l'humeur du voyage.
- **Agent Portal UI** : Refonte totale du tableau de bord agent avec un thème sombre premium et une gestion optimisée des réservations cash.

### 🛠️ Stabilisation Technique
- **Tunnel de Réservation 2.0** : Correction des erreurs d'importation de `framer-motion` et sécurisation des props de signature.
- **Validation IA / OCR** : Système de scan intelligent des documents (CIN/Permis) avec badge de vérification animé.
- **Evolution de la Base de Données** : Ajout de la gestion native des signatures numériques et des modes de paiement directement dans le cycle de vie des réservations.
- **Optimisation du Build** : Nettoyage des fichiers de migration orphelins et synchronisation forcée des composants Next.js pour éviter les problèmes de cache.
