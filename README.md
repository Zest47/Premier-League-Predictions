# Premier League Predictions ⚽🏆

> Application web de pronostics de Premier League, développée avec Spring Boot, React et TypeScript. Pronostiquez les scores, gagnez des points et affrontez les autres participants au classement général.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-green.svg)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Enabled-3178C6.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4.svg)
![Vite](https://img.shields.io/badge/Vite-8.3.4-646CFF.svg)
![ESLint](https://img.shields.io/badge/ESLint-Enabled-4B32C3.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)
![JWT](https://img.shields.io/badge/Auth-JWT-000000.svg)
![Flyway](https://img.shields.io/badge/Database-Flyway-CC0200.svg)

---

## 📌 Présentation du projet

**Premier League Predictions** est une application web permettant aux passionnés de football de réaliser des pronostics sur les matchs de la Premier League anglaise.

L'application repose sur une architecture microservices avec un backend Java Spring Boot, un frontend React/TypeScript et une base de données PostgreSQL.

L'objectif est de proposer une plateforme de pronostics intuitive, sécurisée et évolutive, avec un système de points automatique et un classement des participants.

### Fonctionnalités implémentées

- **Authentification :** connexion avec identifiant et mot de passe, sécurisée par JWT et BCrypt.
- **Gestion des utilisateurs :** inscription, rôles `USER` et `ADMIN`, protection des endpoints.
- **Consultation des matchs :** affichage des équipes, dates, journées, statuts et résultats.
- **Navigation par journée :** sélection directe et boutons Précédente/Suivante.
- **Pronostics :** création et modification des scores prédits avant la fermeture de la journée.
- **Historique des pronostics :** consultation des pronostics enregistrés et des résultats obtenus.
- **Calcul automatique des points :** 3 points pour un score exact, 1 point pour le bon résultat.
- **Classement général :** classement des utilisateurs selon leurs points, avec statistiques complémentaires.
- **Statistiques personnelles :** points, position au classement, scores exacts et taux de réussite.
- **Dashboard :** aperçu des rencontres, résultats, classement et statistiques.
- **Administration :** saisie et modification des scores réels par un administrateur.
- **Mise à jour des classements :** recalcul des points après la validation ou la modification d'un résultat.

### Fonctionnalités prévues

- **Groupes privés :** création et participation à des groupes avec code d'invitation.
- **Classements par groupe :** comparaison des performances entre amis.
- **Statistiques communautaires :** répartition des pronostics par match, après leur fermeture.
- **Gestion avancée des rencontres :** création et modification des matchs depuis l'interface d'administration.
- **Identité visuelle des équipes :** intégration des logos des clubs.
- **Améliorations du Dashboard :** sélection des journées selon les dates et progression du championnat.
- **Déploiement en production :** hébergement du frontend, des microservices et de la base de données.
- **Monétisation :** intégration publicitaire à terme.

---

## ⚽ Règlement et système de points

Les points sont calculés automatiquement lorsqu'un match possède un résultat final enregistré.

| Pronostic | Résultat réel | Points |
| :--- | :--- | :---: |
| Victoire de l'équipe A | Victoire de l'équipe A | **1 pt** |
| Match nul | Match nul | **1 pt** |
| Victoire de l'équipe B | Victoire de l'équipe B | **1 pt** |
| Score exact | Score exact prédit | **3 pts** |
| Mauvais résultat | Résultat différent | **0 pt** |

**Les points ne sont pas cumulables.** Un score exact rapporte 3 points au total, et non 3 + 1.

### Exemples

- Pronostic `2 - 1` | Résultat `2 - 1` → **3 points** (score exact).
- Pronostic `2 - 0` | Résultat `2 - 1` → **1 point** (bon vainqueur).
- Pronostic `1 - 1` | Résultat `2 - 1` → **0 point** (mauvais résultat).

### 🕒 Fermeture des pronostics

Les pronostics sont verrouillés **1 heure avant le début du premier match de la journée concernée**.

Par exemple, si le premier match d'une journée débute à 13h30, les pronostics ferment à 12h30.

Cette règle est vérifiée côté backend afin d'empêcher la création ou la modification de pronostics après la date limite, même en envoyant directement une requête HTTP.

---

## 🛠️ Architecture technique

Le projet utilise une architecture composée de deux microservices Spring Boot, d'un frontend React et d'une base PostgreSQL.

```text
                    ┌───────────────────────────┐
                    │       Frontend React      │
                    │       TypeScript + Vite   │
                    │       Tailwind CSS v4     │
                    └─────────────┬─────────────┘
                                  │
                         HTTP / REST API
                                  │
                    ┌─────────────▼─────────────┐
                    │    Proxy Vite (dev)       │
                    │ /api/auth → port 8081     │
                    │ /api      → port 8082     │
                    └─────────────┬─────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
       ┌─────────▼─────────┐             ┌─────────▼─────────┐
       │   User Service    │             │ Prediction Service│
       │   Spring Boot     │             │   Spring Boot     │
       │   Port 8081       │             │   Port 8082       │
       │                   │             │                   │
       │ - Utilisateurs    │             │ - Équipes         │
       │ - Authentification│             │ - Matchs          │
       │ - JWT / BCrypt    │             │ - Pronostics      │
       │ - Rôles           │             │ - Calcul des pts  │
       └─────────┬─────────┘             │ - Classement      │
                 │                       │ - Administration  │
                 │                       └─────────┬─────────┘
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │    PostgreSQL     │
                        │      Docker       │
                        │                   │
                        │ Flyway Migrations │
                        └───────────────────┘
```

Le proxy Vite est utilisé pendant le développement. Une API Gateway dédiée pourra être ajoutée ultérieurement si nécessaire.

### Backend

| Technologie | Utilisation |
| :--- | :--- |
| Java 21 | Langage backend |
| Spring Boot 4.1.1 | Framework des microservices |
| Spring Security | Authentification et autorisation |
| JWT | Sécurisation des requêtes |
| BCrypt | Hachage des mots de passe |
| Spring Data JPA | Accès aux données |
| PostgreSQL 16 | Base de données relationnelle |
| Flyway | Migrations de base de données |
| Maven | Gestion des dépendances et compilation |
| Docker Compose | Environnement PostgreSQL local |

### Frontend

| Technologie | Utilisation |
| :--- | :--- |
| React | Construction de l'interface |
| TypeScript | Typage statique |
| Vite 8.3.4 | Serveur de développement et build |
| Tailwind CSS v4 | Mise en forme responsive |
| React Router | Navigation entre les pages |
| Lucide React | Icônes de l'interface |
| ESLint | Analyse statique du code |

L'interface utilise un thème sombre avec des accents vert lime, inspiré de l'univers du football.

---

## 📂 Structure du projet

```text
Premier-League-Predictions/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx
│   │   │   └── PlayerStats.tsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── auth-context.ts
│   │   │   └── useAuth.ts
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Matches.tsx
│   │   │   ├── Predictions.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   └── AdminMatches.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── types/
│   │   │   └── api.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── predictionLock.ts
│   │   │   └── currentGameweek.ts
│   │   │
│   │   └── App.tsx
│   │
│   └── package.json
│
├── user-service/
│   ├── src/
│   └── pom.xml
│
├── prediction-service/
│   ├── src/
│   └── pom.xml
│
└── docker-compose.yml
```

---

## 🔐 Authentification et sécurité

L'application utilise une authentification par JWT.

Lors de la connexion, le service utilisateur vérifie les identifiants et retourne un token permettant d'accéder aux endpoints protégés.

Deux rôles sont disponibles :

- `USER` : consultation des matchs, création et modification de ses propres pronostics, accès au classement.
- `ADMIN` : accès aux fonctionnalités utilisateur et à l'administration des résultats.

Les mots de passe sont hachés avec BCrypt.

Le frontend conserve actuellement le token en mémoire. Une actualisation complète de la page nécessite donc une nouvelle connexion.

---

## 🌐 API REST

### User Service — Port 8081

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | Connexion et génération du JWT |
| POST | `/api/users` | Inscription d'un utilisateur |

### Prediction Service — Port 8082

| Méthode | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/health` | Vérification du service |
| GET | `/api/teams` | Liste des équipes |
| GET | `/api/matches` | Liste des matchs |
| GET | `/api/leaderboard` | Classement général |
| POST | `/api/predictions` | Créer un pronostic |
| GET | `/api/predictions/me` | Mes pronostics |
| GET | `/api/predictions/me/results` | Mes résultats et points |
| PUT | `/api/predictions/{id}` | Modifier un pronostic |
| PUT | `/api/admin/matches/{id}/result` | Enregistrer ou modifier un résultat (ADMIN) |

Les endpoints protégés nécessitent un token JWT valide.

---

## 💻 Développement local

### Prérequis

- Java 21
- Node.js compatible avec Vite 8
- Docker Desktop et Docker Compose
- Maven ou Maven Wrapper
- Git

### 1. Démarrer PostgreSQL

Depuis la racine du projet :

```powershell
docker compose up -d
```

### 2. Démarrer le User Service

```powershell
cd user-service

$env:PLP_JWT_SECRET="votre-secret-jwt-de-developpement-suffisamment-long"

.\mvnw.cmd spring-boot:run
```

Le service démarre sur le port `8081`.

### 3. Démarrer le Prediction Service

Dans un nouveau terminal :

```powershell
cd prediction-service

$env:PLP_JWT_SECRET="votre-secret-jwt-de-developpement-suffisamment-long"

.\mvnw.cmd spring-boot:run
```

Le service démarre sur le port `8082`.

**Important :** les deux services doivent utiliser la même clé JWT. Les variables de connexion PostgreSQL doivent également être configurées selon les fichiers de configuration du projet.

### 4. Démarrer le frontend

Dans un troisième terminal :

```powershell
cd frontend

npm install

npm run dev
```

Ouvrez ensuite l'adresse locale affichée par Vite dans le terminal.

### 5. Vérifier le frontend

```powershell
npm run build
npm run lint
```

Ces commandes permettent de vérifier la compilation TypeScript, la génération du build et la qualité statique du code.

---

## 🗺️ Roadmap

| Fonctionnalité | État |
| :--- | :--- |
| Base PostgreSQL et migrations Flyway | ✅ Implémenté |
| Authentification JWT | ✅ Implémenté |
| Gestion des rôles USER / ADMIN | ✅ Implémenté |
| API des équipes et matchs | ✅ Implémenté |
| Création et modification des pronostics | ✅ Implémenté |
| Verrouillage des pronostics | ✅ Implémenté |
| Calcul automatique des points | ✅ Implémenté |
| Classement général | ✅ Implémenté |
| Interface React / TypeScript | ✅ Implémenté |
| Dashboard et statistiques personnelles | ✅ Implémenté |
| Navigation par journée | ✅ Implémenté |
| Administration des résultats | ✅ Implémenté |
| Sélection de journée selon les dates réelles | 🔄 En cours |
| Logos des équipes | ⏳ Prévu |
| Groupes privés | ⏳ Prévu |
| Classements par groupe | ⏳ Prévu |
| Statistiques communautaires | ⏳ Prévu |
| Création de matchs depuis l'administration | ⏳ Prévu |
| Déploiement en production | ⏳ Prévu |
| Monétisation publicitaire | ⏳ Prévu |

---

## 📄 Licence

Projet sous licence MIT, sous réserve de l'ajout du fichier `LICENSE` correspondant dans le dépôt.

---

**Premier League Predictions** — Prédisez. Gagnez. Dominez. ⚽🏆
