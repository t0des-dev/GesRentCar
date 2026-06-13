# 📖 Guide d'Utilisation - Vectoria Rent Car

Bienvenue dans le guide d'utilisation officiel de **Vectoria Rent Car**, la plateforme premium de location de véhicules (ERP B2B & Portail B2C).

Ce document a pour but d'accompagner les **clients** (B2C) dans leur parcours de réservation, et les **administrateurs/agents** (B2B) dans la gestion quotidienne de la flotte et du contenu.

---

## 🏎️ 1. Espace Client (Portail B2C)
L'espace client est la vitrine publique accessible à l'adresse principale (ex: `http://localhost:3000`).

### 1.1. Découverte de la Flotte
- **Recherche & Filtres** : Utilisez la barre de recherche sur la page d'accueil pour trouver le véhicule adapté. Vous pouvez filtrer par **type** (SUV, Sport, Berline), **prix**, ou utiliser le **Vibe Selector** (pour choisir un véhicule selon votre style de voyage : Business Elite, Grand Tourisme, Wild Adventure, Family First).
- **Fiches Véhicules** : Cliquez sur un véhicule pour voir ses détails complets (caractéristiques techniques, équipements, prix à la journée et photos en haute définition).

### 1.2. Processus de Réservation (Tunnel)
1. **Sélection des Dates** : Choisissez vos dates de retrait et de retour.
2. **Options & Suppléments** : Ajoutez des options si nécessaire (Siège enfant, GPS, Assurance Premium, etc.).
3. **Identification / Vérification** : Connectez-vous ou créez un compte. Vous devrez scanner ou uploader vos documents (CIN / Permis de conduire) via notre système OCR intelligent.
4. **Paiement & Signature** : Finalisez la réservation via les modes de paiement sécurisés et apposez votre signature numérique directement sur la plateforme.

### 1.3. Tableau de Bord Client
Une fois connecté, rendez-vous sur votre espace personnel pour :
- **Suivre vos réservations** : Voir le statut (En attente, Confirmé, Terminé, Annulé).
- **Gérer vos contrats** : Télécharger vos contrats et factures.
- **Historique** : Consulter vos précédentes locations et vos paiements.

---

## ⚙️ 2. Espace Administrateur (ERP / Admin Panel B2B)
L'espace d'administration permet de gérer l'intégralité du fonctionnement de l'agence. Il se situe sur l'URL d'administration (ex: `/admin` sur le frontend et le backend).

### 2.1. Tableau de Bord (Dashboard & Analytics)
- Vue d'ensemble des revenus générés.
- Suivi du taux d'occupation de la flotte.
- Statistiques des réservations entrantes et alertes sur les véhicules nécessitant une maintenance.

### 2.2. Gestion de la Flotte (Fleet Management)
- **Ajout/Modification de véhicules** : Renseignez la plaque, le modèle, la catégorie, le prix et les spécifications.
- **Gestion des statuts** : Changez le statut d'un véhicule (Disponible, En location, En maintenance, Retiré).
- **Maintenance** : Gardez un historique des réparations pour chaque véhicule.

### 2.3. Calendrier & Réservations
- **Vue Calendrier** : Visualisez graphiquement les locations en cours et à venir sur le mois.
- **Validation** : Approuvez les réservations en attente ou annulez celles qui posent un problème.
- **Gestion des signatures et paiements** : Vérifiez les contrats signés numériquement et validez la réception des paiements "Cash" en agence.

### 2.4. Gestion de la Vitrine (Storefront CMS)
Le CMS intégré permet aux administrateurs de personnaliser l'interface publique sans toucher au code :
- **Global Branding** : Modifiez les couleurs, le logo et la charte graphique de la vitrine B2C.
- **Section Reorder** : Réorganisez l'ordre des sections (Hero, Catégories, Véhicules populaires, etc.) par un simple glisser-déposer.
- **Storefront Preview** : Prévisualisez en temps réel les changements appliqués à l'interface client avant de les publier.

### 2.5. Gestion des Utilisateurs (CRM)
- Accédez à la base de données de vos clients.
- Vérifiez manuellement les documents d'identité (si le système OCR a remonté une alerte).
- Bloquez ou approuvez des comptes clients.

---

## 🔑 3. Accès de Démonstration (Rappel)

Pour tester la plateforme en local :

**Portail Client B2C (`http://localhost:3000`) :**
- Email : `client@vectoria.com`
- Mot de passe : `Client2026!`

**Admin Panel B2B (`http://localhost:3000/admin` ou `http://localhost:8000/admin`) :**
- Email : `admin@vectoria.com`
- Mot de passe : `Admin2026!`

---

*Besoin d'aide supplémentaire ? Contactez l'équipe de support Vectoria.*
