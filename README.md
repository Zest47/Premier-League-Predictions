# Premier League Predictions ⚽🏆

> Application web orientée PC pour pronostiquer les résultats des matchs de la Premier League anglaise et s'affronter entre amis ou au sein de la communauté.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791.svg)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ed.svg)

---

## 📌 Présentation du projet

**Premier League Predictions** est une application web permettant aux passionnés de football de réaliser des pronostics sur les matchs de la Premier League. 

### Fonctionnalités clés
* **Pronostics :** Prédisez le résultat et le score exact des matchs avant le début de chaque journée.
* **Calcul automatique :** Attribution automatique des points dès qu'un résultat est validé.
* **Dimension sociale :** Créez ou rejoignez des groupes privés avec un code d'invitation pour comparer vos résultats entre amis.
* **Classement général & Groupes :** Suivez votre position en temps réel au classement global ou au sein de vos groupes.
* **Statistiques communautaires :** Visualisez les tendances globales de pronostics pour chaque match (disponibles uniquement après la fermeture des pronostics).
* **Administration :** Interface dédiée aux administrateurs pour créer des matchs et encoder les scores réels.

---

## ⚽ Règlement & Système de points

Les points sont calculés automatiquement dès qu'un match est terminé et que son résultat est validé[cite: 1] :

| Pronostic | Résultat réel | Points attribués |
| :--- | :--- | :---: |
| **Victoire de l'équipe A** | Victoire de l'équipe A | **1 pt** |
| **Match nul** | Match nul | **1 pt** |
| **Victoire de l'équipe B** | Victoire de l'équipe B | **1 pt** |
| **Score exact** | Score exact prédit | **3 pts** *(total, non cumulable)* |
| **Mauvais résultat** | Résultat différent | **0 pt** |

> **Exemples :**
> * Pronostic `2 - 1` | Résultat `2 - 1` ➔ **3 points** (Score exact)
> * Pronostic `2 - 0` | Résultat `2 - 1` ➔ **1 point** (Bon vainqueur)
> * Pronostic `1 - 1` | Résultat `2 - 1` ➔ **0 point**

### 🕒 Règle de fermeture des pronostics (Deadline)
* Les pronostics ferment au maximum **1 heure avant le début du premier match** de la journée concernée.
* *Exemple :* Si le premier match débute à 13h30, la clôture est fixée à **12h30 précis**.
* La restriction est strictement vérifiée **côté serveur** pour des raisons de sécurité.

---

## 🛠️ Architecture Technique

L'application repose sur une architecture microservices composée de deux services indépendants communiquant via API REST, un frontend React et une base de données PostgreSQL.

```text
                    ┌────────────────────┐
                    │     React Web      │
                    │     Frontend       │
                    └─────────┬──────────┘
                              │ HTTP/REST
                              ▼
             ┌────────────────────────────────┐
             │       API Gateway / Backend    │
             └───────────────┬────────────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
       ┌─────────────────┐     ┌─────────────────┐
       │ User & Group    │     │ Match &         │
       │ Service         │     │ Prediction Svc  │
       └────────┬────────┘     └────────┬────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                    ┌───────────────┐
                    │  PostgreSQL   │
                    └───────────────┘
