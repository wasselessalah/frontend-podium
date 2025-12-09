# 🎯 Podium Frontend

Plateforme frontend pour la gestion des podiums et classements.
Stack: **Next.js 15** + **React 19** + **NextAuth** + **TypeScript** + **Tailwind CSS**

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18+ recommandé) - [Télécharger](https://nodejs.org/)
- **npm** ou **yarn** ou **pnpm** (géré par Node.js)
- **Git** (pour cloner le repository)

Vérifiez vos installations :
```bash
node --version    # Doit afficher v18.0.0 ou plus
npm --version     # Doit afficher 8.0.0 ou plus
```

---

## 🚀 Guide d'activation complet

### Étape 1️⃣ : Cloner ou accéder au projet

```bash
# Si vous clonez le projet
git clone <url-du-repository>
cd frontend-podium

# Ou accédez au dossier existant
cd ./frontend-podium
```

### Étape 2️⃣ : Installer les dépendances

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

**Que se passe-t-il ?**
- Télécharge et installe tous les packages Node.js listés dans `package.json`
- Crée un dossier `node_modules/` avec toutes les dépendances
- Génère un fichier `package-lock.json` (ne pas supprimer)

### Étape 3️⃣ : Configurer les variables d'environnement

1. **Copier le fichier d'exemple** :
   ```bash
   cp .env.example .env.local
   ```

2. **Éditer le fichier** `.env.local` :
   ```bash
   nano .env.local  # ou ouvrir avec votre éditeur
   ```

3. **Configurer les variables** :

   ```env
   # URL de votre API backend (remplacez localhost:3001 par votre adresse)
   NEXT_PUBLIC_API_URL=http://localhost:3001

   # Secret pour signer les tokens (générez une clé sécurisée)
   # Pour générer: openssl rand -base64 32
   NEXTAUTH_SECRET=votre-cle-secrete-ici

   # URL d'accès à l'application
   NEXTAUTH_URL=http://localhost:3000

   # Mode debug (false en production)
   NEXTAUTH_DEBUG=false
   ```

   **⚠️ Important** :
   - **.env.local est ignoré par Git** (voir `.gitignore`) - Ne pas le commiter !
   - **NEXTAUTH_SECRET** : Doit être une chaîne aléatoire longue en production
   - **NEXT_PUBLIC_API_URL** : Doit pointer vers votre backend

### Étape 4️⃣ : Lancer le serveur de développement

```bash
npm run dev
```

**Résultat attendu** :
```
  ▲ Next.js 15.3.5
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.3s
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📦 Scripts disponibles

```bash
# Développement (avec hot reload)
npm run dev

# Build pour la production
npm run build

# Lancer la version buildée
npm start

# Vérifier les erreurs ESLint
npm run lint
```

---

## 🔐 Configuration NextAuth détaillée

### Qu'est-ce que NextAuth ?

NextAuth est une bibliothèque d'authentification pour Next.js qui gère :
- La connexion/déconnexion
- Les sessions utilisateur
- Les tokens JWT
- La protection des routes

### Fichiers clés

- **`src/auth.ts`** : Configuration principale de NextAuth avec Credentials provider
- **`src/auth.config.ts`** : Configuration de sécurité et des callbacks
- **`src/middleware.ts`** : Middleware pour protéger les routes

### Flux d'authentification

1. L'utilisateur soumet un formulaire de login
2. NextAuth envoie les credentials à `auth.ts` → `loginAdmin()`
3. `loginAdmin()` appelle votre API backend (`/auth/login`)
4. Si succès, un token JWT est créé et stocké en session
5. L'utilisateur peut accéder aux routes protégées

### Variables d'environnement requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL de votre API | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | Clé secrète pour les tokens | `Hx8k9mL2pQ...` (aléatoire) |
| `NEXTAUTH_URL` | URL publique de l'app | `http://localhost:3000` |

---

## 🛠️ Troubleshooting

### ❌ "Module not found"
```bash
# Solution: Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Cannot GET /admin/dashboard"
- Vérifiez que votre API backend est en cours d'exécution
- Vérifiez `NEXT_PUBLIC_API_URL` dans `.env.local`

### ❌ "NextAuth error: Missing NEXTAUTH_SECRET"
- Vérifiez que `.env.local` existe
- Vérifiez que `NEXTAUTH_SECRET` est défini

### ❌ "Network request failed"
```bash
# Vérifiez que l'API backend est accessible
curl http://localhost:3001/health

# Vérifiez le port utilisé
lsof -i :3000  # Pour le frontend
lsof -i :3001  # Pour le backend
```

### ❌ Le port 3000 est déjà utilisé
```bash
# Tuer le processus sur le port 3000
kill -9 $(lsof -t -i :3000)

# Ou utiliser un port différent
npm run dev -- -p 3001
```

---

## 📁 Structure du projet

```
frontend-podium/
├── src/
│   ├── app/                    # Routes et pages Next.js
│   │   ├── admin/              # Pages d'admin (protégées)
│   │   ├── login/              # Page de connexion
│   │   ├── api/                # Routes API
│   │   └── page.tsx            # Page d'accueil
│   ├── components/             # Composants React réutilisables
│   ├── lib/                    # Utilitaires (API calls, etc.)
│   ├── auth.ts                 # Configuration NextAuth
│   ├── auth.config.ts          # Callbacks et sécurité
│   └── middleware.ts           # Protection des routes
├── public/                     # Assets statiques
├── .env.example                # Exemple de configuration
├── .env.local                  # Configuration locale (gitignore)
├── next.config.ts              # Configuration Next.js
├── tsconfig.json               # Configuration TypeScript
└── package.json                # Dépendances du projet
```

---

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation NextAuth](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📝 Notes importantes

- Le fichier `.env.local` est **gitignore** - ne pas le commiter
- Le backend doit tourner sur `http://localhost:3001` (ou adapter `NEXT_PUBLIC_API_URL`)
- Les logs d'authentification sont dans la console du navigateur et du serveur
- En production, toujours changer `NEXTAUTH_SECRET` et `NEXTAUTH_URL`

---

## 👨‍💻 Environnement de développement recommandé

- **Éditeur** : VS Code (avec extension ES7+ React/Redux/React-Native snippets)
- **Extensions VS Code** :
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin
- **Terminal** : Bash, Zsh ou PowerShell
- **Navigateur** : Chrome/Firefox avec DevTools

---

**Besoin d'aide ?** Consultez les logs dans la console ou contactez l'équipe backend.
