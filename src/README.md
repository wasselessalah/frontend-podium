# Structure du projet Frontend

## Organisation des dossiers

### `/app`
- Dossier principal de Next.js (App Router)
- Contient les pages et layouts principaux

### `/components`
- **`/ui`** - Composants d'interface réutilisables (boutons, inputs, modals, etc.)
- **`/layout`** - Composants de mise en page (header, footer, sidebar, etc.)
- **`/forms`** - Composants spécifiques aux formulaires
- **`/common`** - Composants génériques partagés

### `/pages`
- Pages complètes de l'application
- Organisation par fonctionnalité

### `/features`
- Fonctionnalités complètes avec leurs composants, hooks et logique
- Organisation par domaine métier

### `/hooks`
- Custom hooks React réutilisables

### `/lib`
- Utilitaires et configurations tierces (axios, validations, etc.)

### `/services`
- Services pour les appels API et la logique métier

### `/types`
- Définitions TypeScript partagées

### `/utils`
- Fonctions utilitaires génériques

### `/constants`
- Constantes globales de l'application

### `/styles`
- Styles globaux et thèmes

### `/data`
- Données statiques et mocks