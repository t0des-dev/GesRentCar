# 🎓 Guide de Présentation et de Soutenance — Vectoria Rent Car

Ce guide a été conçu pour vous accompagner dans la préparation de votre support de présentation (Slides) et de votre prestation orale pour la soutenance de votre Projet de Fin d'Études (PFE).

---

## 📅 Structure Conseillée du Diaporama (15 - 20 minutes)

### Slide 1 : Page de Garde
*   **Titre :** Conception et Réalisation d'une Plateforme SaaS de Gestion de Flotte et de Location de Véhicules Premium.
*   **Sous-titre :** Portail Client B2C Immersif & ERP d'Administration B2B.
*   **Présenté par :** [Votre Nom Complet]
*   **Sous la direction de :** [Nom de votre encadrant académique] & [Nom de votre encadrant professionnel]
*   **Logo :** Logo de votre école / université & Logo de Vectoria Rent Car.

### Slide 2 : Contexte du Projet & Organisme d'Accueil
*   **Visuel :** Logo Vectoria Rent Car et photos de véhicules de prestige.
*   **Points clés :**
    *   Le marché de la location de voitures haut de gamme au Maroc (Casablanca, Marrakech, aéroports).
    *   Exigence de clients locaux et internationaux pour une expérience utilisateur (UX) irréprochable et instantanée.
    *   Nécessité de moderniser les outils administratifs internes (souvent basés sur Excel ou des ERP obsolètes).

### Slide 3 : Problématique & Objectifs
*   **Problèmes identifiés :**
    1.  **Risques de double réservation** (concurrence de requêtes sur le même véhicule).
    2.  **Lourdeur des démarches** (saisie manuelle des permis, signatures de contrats papier).
    3.  **Tarifs rigides** (manque à gagner pendant les week-ends ou la haute saison).
    4.  **Absence de reporting consolidé** (marge nette réelle par véhicule après coûts de maintenance).
*   **Objectifs du PFE :** Développer un écosystème découplé SaaS réunissant un portail de réservation d'inspiration luxe et un ERP complet.

### Slide 4 : Architecture Logique & Stack Technologique
*   **Schéma :** Architecture Headless (découplée).
*   **Stack Technique :**
    *   **Frontend B2C :** Next.js 14 (App Router), Tailwind CSS, Framer Motion, TanStack React Query.
    *   **Backend & ERP B2B :** Laravel 12 (REST API), Filament PHP v5 (Panel Admin).
    *   **DevOps / Données :** PostgreSQL, Redis (Workers/Files d'attente), Docker & Docker Compose.
    *   **Modularité Applicative :** Structuration du frontend en répertoires fonctionnels isolés (`modules/fleet`, `modules/booking`, `modules/payments`, `modules/ai`) et du backend en services métiers indépendants (`PricingService`, `AvailabilityEngine`), garantissant un couplage faible et une haute testabilité.

### Slide 5 : Base de Données & Modélisation
*   **Schéma :** Diagramme Entité-Association (MCD) simplifié (focus sur les relations clés : `Vehicles`, `Reservations`, `Clients`, `Payments`, `Contracts`, `Maintenances`).
*   **Points forts :** Structure modulaire avec traçabilité complète des statuts, archivage sécurisé des contrats et suivi analytique des dépenses et recettes.

### Slide 6 : Focus Technique 1 — Moteur de Disponibilité & Concurrence
*   **Concept :** Gestion sécurisée des réservations pour éviter le chevauchement de dates.
*   **Solution implémentée :** Le composant `AvailabilityEngine` utilise le **Pessimistic Locking (SELECT FOR UPDATE)** via les transactions de la base de données.
*   **Pourquoi ? :** Verrouillage strict de l'enregistrement du véhicule au début de la transaction, empêchant toute requête concurrente de créer une réservation simultanée pour des dates chevauchantes.

### Slide 7 : Focus Technique 2 — Algorithme de Tarification Dynamique
*   **Algorithme :** Calcul en temps réel du tarif journalier (`PricingService`).
*   **Variables prises en compte :**
    1.  **Occupation de la flotte :** +20% si demande forte (>80%), -10% si demande faible (<30%).
    2.  **Saisonnalité :** +30% en juillet, août, et décembre.
    3.  **Week-ends :** +10% sur les tarifs journaliers.
    4.  **Fidélité / Longue durée :** Remises automatiques sur le total de -10% ($\ge$ 7j) et -15% ($\ge$ 14j).

### Slide 8 : Fonctionnalités Clés du Portail B2C (Démo visuelle)
*   **Visuel :** Captures d'écran de l'interface client (Glassmorphism, animations Framer Motion).
*   **Points clés :**
    *   **Vibe Selector :** Navigation par émotion de voyage (Business, Grand Tourisme, Wild Adventure, Family).
    *   **Identity verification par OCR :** Téléversement du permis / CIN et extraction automatique via Tesseract OCR et expressions régulières.
    *   **Signature en ligne :** Signature tactile sur écran et génération de contrat PDF à la volée.
    *   **AI Concierge (RAG) :** Chatbot intelligent intégré, interrogeant le contrôleur `ConciergeController` pour proposer des véhicules adaptés aux besoins de l'utilisateur.

### Slide 9 : Fonctionnalités Clés de l'ERP Admin B2B
*   **Visuel :** Captures d'écran du panel Filament v5.
*   **Points clés :**
    *   **Storefront CMS :** Restructuration en direct de l'ordre des sections de la page d'accueil par Drag-and-Drop.
    *   **Calendrier de flotte :** Vue graphique interactive des plannings de location.
    *   **Rentabilité (Analytics) :** Module financier croisant recettes (locations) et coûts (dépenses, maintenances).

### Slide 10 : Architecture de Déploiement sous Docker
*   **Schéma :** Les conteneurs reliés (multi-container app orchestration).
*   **Les 7 Services Orchestrés :**
    1.  `gesrentcar-web` : Serveur web **Nginx** (Reverse Proxy & routage).
    2.  `gesrentcar-frontend` : Next.js 14 compilé en mode Standalone.
    3.  `gesrentcar-backend` : Serveur d'API PHP 8.2-FPM.
    4.  `gesrentcar-worker` : Démon de traitement asynchrone des files d'attente (Laravel queue worker).
    5.  `gesrentcar-scheduler` : Gestionnaire de tâches planifiées (backups S3, alertes documents expirés).
    6.  `gesrentcar-db` : Base de données PostgreSQL 15.
    7.  `gesrentcar-redis` : Cache en mémoire Redis 7 pour les files d'attente.

### Slide 11 : Avantages Clés de la Conteneurisation (Docker)
*   **Points clés :**
    *   **Isomorphisme d'environnement :** Résolution définitive du problème *"ça fonctionne sur ma machine"* entre le développement et la production.
    *   **Isolation & Sécurité :** Chaque service tourne dans son propre espace isolé avec des volumes spécifiques (ex: stockage privé des pièces d'identité).
    *   **Déploiement Reproductible :** Automatisation du build (Next.js standalone) assurant des mises à jour simples et sécurisées.
    *   **Scalabilité :** Possibilité de multiplier séparément les conteneurs frontend ou backend en fonction de la charge.

### Slide 12 : Bilan, Perspectives & Démo Live
*   **Bilan :** Objectifs atteints avec succès, plateforme fonctionnelle de bout en bout et prête au déploiement.
*   **Perspectives :**
    *   Module de détection automatique des rayures carrosserie par Computer Vision (IA).
    *   Application mobile de déverrouillage de portes connecté.
*   *Lancement de la Démo en Direct.*

---

## 🚀 Le Scénario de Démonstration (Démo Live de 5 minutes)

Ne faites pas une démo générale et désordonnée. Suivez un **scénario utilisateur (Storytelling)** bien précis :

1.  **Le Vibe Selector :** Connectez-vous sur le portail client (`http://localhost:3000`). Choisissez la vibe *"Wild Adventure"* pour montrer que le catalogue filtre automatiquement les SUV et 4x4 avec des transitions animées et élégantes.
2.  **Le Tunnel de Réservation :** Sélectionnez un véhicule, choisissez des dates. Montrez que le tarif est calculé de manière dynamique (ex: choisissez une location de 8 jours pour voir s'activer la réduction de 10% ou choisissez un week-end pour voir la majoration).
3.  **L'OCR Intelligent :** Étape de vérification d'identité. Téléversez une photo de carte d'identité (ou laissez le mode Démo s'exécuter en cas d'erreur de scanner). Montrez que le système extrait instantanément le nom et le numéro de CIN pour pré-remplir les champs avec le badge vert **"EXTRAIT PAR IA"**.
4.  **La Signature & Le Paiement :** Signez le contrat sur l'écran tactile, sélectionnez *"Paiement à la prise en charge"*, et valisez la réservation.
5.  **La Réception du Contrat & WhatsApp :** Montrez que le contrat PDF a été généré avec la signature intégrée, et mentionnez le déclenchement de la notification WhatsApp/SMS reçue sur le téléphone du client grâce aux files d'attente asynchrones de Redis.
6.  **Le Panel ERP (Filament v5) :** Ouvrez le panel d'administration (`http://localhost:8000/admin`). Montrez la réservation reçue, l'indicateur comptable mis à jour, et changez l'ordre des sections CMS de la page d'accueil pour illustrer la flexibilité de la plateforme.

---

## 💡 Questions Clés du Jury (Et comment y répondre avec succès)

Voici les questions les plus probables que le jury d'ingénieurs ou d'enseignants-chercheurs pourrait vous poser :

### Q1 : Pourquoi avoir choisi Next.js (Frontend) et Laravel (API/ERP) plutôt qu'un seul framework monolithique (tout Laravel) ?
> **Réponse attendue :** 
> *"Nous avons opté pour une architecture découplée (Headless) pour deux raisons principales. Premièrement, l'évolutivité : le frontend Next.js peut être remplacé par une application mobile native ou déployé sur un CDN mondial (Vercel) sans toucher à la logique métier du backend. Deuxièmement, la performance et le SEO : Next.js 14 permet de générer des pages côté serveur (SSR) et de gérer le référencement naturel dynamique pour la vitrine B2C premium, tandis que Laravel 12 sert d'API REST robuste et sécurisée. Enfin, Filament v5 côté Laravel nous a permis de générer un ERP d'administration en un temps record."*

### Q2 : Comment gérez-vous la sécurité des documents clients (CIN/Permis) ? Sont-ils accessibles en ligne par n'importe qui ?
> **Réponse attendue :** 
> *"Absolument pas, c'est un point critique de sécurité et de conformité RGPD. Les documents scannés ne sont jamais stockés dans le dossier `/public` de l'application. Ils sont enregistrés dans le répertoire privé `storage/app/private/`. Pour les afficher, nous avons créé un endpoint API `/api/documents/preview/{filename}` protégé par un middleware d'authentification et d'audit. Seul un agent d'agence ou un administrateur connecté ayant les droits nécessaires peut visualiser le document, qui est alors diffusé sous forme de flux binaire temporaire."*

### Q3 : Que se passe-t-il si deux clients cliquent en même temps pour louer le même véhicule aux mêmes dates ?
> **Réponse attendue :** 
> *"Pour contrer les Race Conditions, nous avons implémenté un système de verrouillage pessimiste (Pessimistic Locking) au niveau de notre base de données via notre `AvailabilityEngine`. Lorsqu'un processus de réservation commence, nous exécutons l'instruction `lockForUpdate()` sur la ligne du véhicule concerné au sein d'une transaction de base de données. SQL bloque alors cette ligne pour toute autre requête d'écriture. Si une requête concurrente tente de réserver le même véhicule, elle attendra que la première transaction soit validée ou rejetée, constatant ensuite que le véhicule n'est plus disponible."*

### Q4 : Pourquoi utiliser Redis pour les SMS et WhatsApp ?
> **Réponse attendue :** 
> *"Les appels d'APIs tierces (comme Twilio pour les SMS ou l'API WhatsApp de Meta) prennent du temps (souvent entre 1 et 3 secondes). Si nous faisions ces requêtes de manière synchrone pendant que le client clique sur 'Confirmer', son navigateur resterait bloqué et l'expérience utilisateur serait dégradée. En utilisant Redis, nous déléguons ces envois à des tâches d'arrière-plan (Jobs Laravel). La route HTTP répond immédiatement au client en moins de 100ms, tandis que le Worker PHP relié à Redis traite l'envoi de la notification WhatsApp en tâche de fond de manière transparente."*

### Q5 : Quels sont les avantages d'avoir conteneurisé l'application avec Docker et comment s'articule votre docker-compose ?
> **Réponse attendue :** 
> *"La conteneurisation via Docker garantit que l'ensemble du système s'exécute de manière identique en développement local et en production sur le VPS. Notre fichier `docker-compose.prod.yml` gère l'orchestration de 7 conteneurs distincts et isolés :
> - **gesrentcar-web (Nginx)** : Il sert de Reverse Proxy d'entrée (port 8080 en interne, redirigé), gère le chiffrement HTTPS et sert les fichiers publics.
> - **gesrentcar-frontend (Next.js)** : Exécute le portail client compilé en mode autonome optimisé.
> - **gesrentcar-backend (Laravel/PHP-FPM)** : Fait tourner l'API REST et l'ERP Filament v5.
> - **gesrentcar-worker & gesrentcar-scheduler** : Gèrent de façon autonome le traitement asynchrone des notifications (jobs) et les tâches chronométrées.
> - **gesrentcar-db (PostgreSQL 15)** & **gesrentcar-redis (Redis 7)** : Assurent le stockage persistant et la mémoire cache des queues.
> L'avantage majeur est qu'aucune installation de PHP, Node ou PostgreSQL n'est requise sur le serveur hôte. De plus, les ressources matérielles sont isolées, assurant une sécurité élevée, et les déploiements s'effectuent sans aucune interruption de service (*Zero Downtime*)."*

### Q6 : En quoi votre plateforme est-elle considérée comme modulaire et quels en sont les avantages ?
> **Réponse attendue :** 
> *"La modularité de la plateforme s'exprime à deux niveaux :
> 1. **Au niveau du Frontend (Next.js)** : Nous avons adopté une architecture orientée fonctionnalités (*Feature-Driven Architecture*) en regroupant le code dans un répertoire `src/modules/` découpé en domaines métiers autonomes (ex: `fleet` pour la flotte, `booking` pour le tunnel de réservation, `payments` pour la facturation).
> 2. **Au niveau du Backend (Laravel)** : Les contrôleurs ne contiennent aucune logique métier complexe ; celle-ci est déléguée à des services de domaine indépendants (ex: `AvailabilityEngine` pour les verrous de réservation, `PricingService` pour le calcul tarifaire dynamique).
> Les avantages sont majeurs : cela garantit un couplage faible, facilite la maintenance isolée de chaque module sans régression sur les autres, et permet à plusieurs développeurs de collaborer en parallèle sur des fonctionnalités différentes."*

