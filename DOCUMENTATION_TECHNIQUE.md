# 🚗 Documentation Technique Détaillée — Rôle des Fonctions du Code

Cette documentation détaille l'organisation, le rôle et le fonctionnement de chaque fonction majeure dans le code de la plateforme **Vectoria Rent Car** (Backend Laravel 12, Frontend Next.js 14, et Mobile Flutter).

---

## 🛠️ 1. Architecture Backend (Laravel 12 / PHP 8.2)

### 📂 Services Métiers (namespace `App\Services`)

#### 🔹 [AvailabilityEngine.php](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/backend/app/Services/AvailabilityEngine.php)
Ce moteur est le noyau de gestion de la disponibilité et de la concurrence pour les réservations.

*   `secureBooking(int $vehicleId, $startDate, $endDate, array $reservationData): Reservation`
    *   **Rôle** : Réserve un véhicule de manière sécurisée en appliquant des verrous de base de données.
    *   **Fonctionnement** : Il initie une transaction de base de données, utilise un **verrou pessimiste** (`lockForUpdate()`) sur l'enregistrement du véhicule pour bloquer d'autres écritures concurrentes. Il vérifie ensuite les chevauchements de dates avec d'autres réservations actives (`pending_payment`, `pending_partner`, `confirmed`, `active`). S'il n'y a pas d'overlap, il calcule le prix de base, gère le montant de l'acompte (10%) et enregistre la réservation en base de données avant de valider la transaction.
*   `isAvailable(int $vehicleId, $startDate, $endDate): bool`
    *   **Rôle** : Vérification rapide de disponibilité.
    *   **Fonctionnement** : Effectue une simple requête SQL de type `exists()` pour détecter s'il y a des réservations actives chevauchant la période demandée, sans bloquer la base de données. Idéal pour les listes de recherche.

#### 🔹 [PricingService.php](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/backend/app/Services/PricingService.php)
Ce service calcule de manière dynamique le tarif global d'une location en temps réel.

*   `calculateTotal(Vehicle $vehicle, int $days, array $options = [], ?float $occupancyRate = null, ?Carbon $startDate = null): array`
    *   **Rôle** : Point d'entrée principal retournant le prix total, le tarif de base, le supplément des options et un récapitulatif détaillé (*breakdown*).
*   `getDynamicRate(Vehicle $vehicle, ?float $occupancyRate = null, ?Carbon $startDate = null, int $days = 1): array`
    *   **Rôle** : Calcule le prix de base journalier après application des multiplicateurs d'occupation (forte demande à >80% : +20% ; basse saison à <30% : -10%), de saisonnalité marocaine (juillet, août, décembre : +30%), et de week-end (départ ven-dim : +10%), ainsi que des remises longue durée (-10% dès 7j, -15% dès 14j).
*   `calculateOptionsPrice(array $options, int $days): float`
    *   **Rôle** : Applique les coûts des options à la journée (Flexibilité : 60 MAD/jour ; Kilométrage illimité : 140 MAD/jour).
*   `buildBreakdown(Vehicle $vehicle, int $days, float $dailyRate, array $options, array $dynamic): array`
    *   **Rôle** : Génère un tableau descriptif structurant le prix (ex: "Tarif weekend (+10%)", "Sélection d'options").

---

### 📂 Contrôleurs d'API (namespace `App\Http\Controllers\Api`)

#### 🔹 [ConciergeController.php](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/backend/app/Http/Controllers/Api/ConciergeController.php)
Gère le chatbot d'assistance virtuelle intelligent.

*   `chat(Request $request)`
    *   **Rôle** : Analyse la question de l'utilisateur, interroge la flotte disponible et suggère des véhicules correspondants.
    *   **Fonctionnement** : Il parse le message et détecte sémantiquement les intentions de l'utilisateur via des mots-clés :
        *   Mots sport/vitesse $\rightarrow$ catégorie sport/luxury.
        *   Mots famille/bagages $\rightarrow$ catégorie SUV/break et $\ge$ 5 places.
        *   Mots business/travail $\rightarrow$ catégorie berline/executive.
        *   Mots aventure/piste $\rightarrow$ SUV/4x4.
        Il formule ensuite une réponse en langage naturel avec des suggestions d'objets véhicules cliquables.

#### 🔹 [OcrController.php](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/backend/app/Http/Controllers/Api/OcrController.php)
Contrôleur gérant la numérisation des pièces d'identité et l'intelligence artificielle d'analyse.

*   `scan(Request $request)`
    *   **Rôle** : Traite les fichiers d'images de permis de conduire ou de cartes nationales d'identité (CIN).
    *   **Fonctionnement** : Sauvegarde le fichier de manière sécurisée et appelle l'exécutable système Tesseract OCR. Il analyse le texte extrait brut avec des Regex pour retrouver la CIN marocaine ou le numéro de permis, et renvoie ces informations structurées au format JSON.
*   `analyzeDamage(Request $request)`
    *   **Rôle** : (Perspective) Analyser l'état du véhicule à partir de photos de départ et retour.

#### 🔹 [ContractController.php](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/backend/app/Http/Controllers/Api/ContractController.php)
Gère la génération des PDF officiels et l'intégration des signatures.

*   `generate(Reservation $reservation)`
    *   **Rôle** : Assemble le PDF officiel du contrat avec les coordonnées du client, le modèle du véhicule, les dates et la signature.
*   `sign(Request $request, Reservation $reservation)` / `publicSign(Request $request, Reservation $reservation)`
    *   **Rôle** : Associe l'image vectorielle en Base64 de la signature du client à la réservation pour acter le contrat.

#### 🔹 [StripeController.php](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/backend/app/Http/Controllers/Api/StripeController.php) / [CmiController.php](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/backend/app/Http/Controllers/Api/CmiController.php)
Gèrent le cycle de vie du paiement.

*   `createIntent(Request $request)` / `init(Request $request, Reservation $reservation)`
    *   **Rôle** : Initialisent la session de transaction et renvoient le code client (client_secret) nécessaire au frontend pour monter le formulaire de paiement.
*   `confirm(Request $request)` / `callback(Request $request)` / `webhook(Request $request)`
    *   **Rôle** : Capturent la réponse (synchrone ou asynchrone via webhook) de la passerelle de paiement, valident la transaction et modifient le statut de la réservation en "confirmé".

---

## 💻 2. Architecture Frontend (Next.js 14 / React 19)

### 📂 Hooks Personnalisés (namespace `src/hooks/`)

#### 🔹 [useConcierge.ts](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/frontend/src/hooks/useConcierge.ts)
Pilote l'état de l'interface de discussion de l'assistant virtuel.

*   `handleSend()`
    *   **Rôle** : Transmet le message de l'utilisateur à l'API backend `/api/v1/concierge/chat`.
    *   **Résilience** : En cas d'erreur de réseau, il bascule sur un algorithme local simulant les réponses du bot en se basant sur des mots-clés saisis (mariage, sport, aventure, affaires) pour sécuriser la présentation.

---

### 📂 Composants UI (namespace `src/components/` & `src/modules/`)

#### 🔹 [VibeSelector.tsx](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/frontend/src/components/VibeSelector.tsx)
Composant d'exploration de flotte par humeur/vibe.

*   `onClick()`
    *   **Rôle** : Redirige l'utilisateur vers la page `/fleet?lifestyle=X` en fonction de la vibe choisie, appliquant une transition fluide.

#### 🔹 [IdentityStep.tsx](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/frontend/src/modules/booking/components/IdentityStep.tsx)
Composant gérant l'étape de scan OCR au sein du tunnel de réservation.

*   `onUpload(File file)`
    *   **Rôle** : Soumet le fichier de document d'identité à l'API OCR du backend, pré-remplit les champs et affiche le badge vert réactif "EXTRAIT PAR IA".

---

## 📱 3. Application Mobile (Flutter)

### 📂 Services (namespace `lib/services/`)

#### 🔹 [ocr_service.dart](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/mobile/lib/services/ocr_service.dart)
*   `scanDocument(File imageFile, String type): Future<OcrResult>`
    *   **Rôle** : Analyse une image locale prise par la caméra et en extrait les textes via Google ML Kit Text Recognition.
*   `_parseCIN(String text): OcrResult` / `_parseLicense(String text): OcrResult`
    *   **Rôle** : Capturent respectivement le numéro de CIN (regex : `[A-Z]{1,2}[0-9]{5,7}`) et de permis (regex : `[0-9]{2,}\/[0-9]{4,}`) à partir du texte brut extrait.

#### 🔹 [sync_service.dart](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/mobile/lib/services/sync_service.dart)
*   `saveOfflineClient(Client client): Future<void>`
    *   **Rôle** : Enregistre localement les informations du client dans la file d'attente (mocking Hive Box) avec le flag `isSynced = false` en prévision d'une absence de réseau.
*   `syncData(): Future<int>`
    *   **Rôle** : Parcourt tous les enregistrements hors-ligne non synchronisés, tente de les soumettre à l'API du backend Laravel et résout les éventuels conflits d'unicité de CIN.

---

### 📂 Écrans & Point d'entrée (namespace `lib/screens/` & `lib/`)

#### 🔹 [scan_screen.dart](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/mobile/lib/screens/scan_screen.dart)
*   `_pickAndScan(String type): Future<void>`
    *   **Rôle** : Ouvre l'appareil photo du smartphone via `image_picker`, capture l'image, lance `ocrService.scanDocument()` et met à jour l'état de l'écran avec les données décryptées.
*   `_buildInfoRow(String label, String value): Widget`
    *   **Rôle** : Met en majuscule le label grâce à `.toUpperCase()` et construit des lignes d'information stylisées de manière responsive.

#### 🔹 [main.dart](file:///c:/Users/PC/Desktop/workflow/VectoriaRentCar/mobile/lib/main.dart)
*   `main()`
    *   **Rôle** : Point d'entrée fondamental de l'application Flutter. Démarre l'écosystème Material 3 et configure le widget principal pour cibler `ScanScreen`.
