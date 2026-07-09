# ElectroBike API — solution du mini-projet

Solution de référence du mini-projet DevOps du Jour 2 (support de cours *Projet Start-up :
Agile & DevOps*, Master 1 Informatique). Elle implémente intégralement le Sprint 1 défini le
Jour 1 (Module 5) :

> « À la fin du sprint, un utilisateur peut localiser un vélo disponible, le réserver et voir le
> prix estimé de son trajet depuis l'application mobile. »

## Endpoints

| Méthode | Route                          | Description                                   |
|---------|---------------------------------|------------------------------------------------|
| GET     | `/health`                       | Vérifie que l'API répond                       |
| GET     | `/api/bikes`                    | Liste les vélos disponibles (batterie ≥ 20 %)   |
| POST    | `/api/reservations`             | Réserve un vélo pendant 5 minutes (`{ bikeId }`)|
| GET     | `/api/reservations/:id/price`   | Estime le prix du trajet en cours               |

## Architecture : deux modes, un seul code

Cette solution illustre le **pattern Repository** : les routes (`src/routes/`) ne savent jamais où
sont stockées les données, elles appellent seulement `bikeRepository.findAvailable(...)` par exemple.
L'implémentation réellement utilisée dépend de la variable d'environnement `USE_DATABASE` :

| Mode | `USE_DATABASE` | Stockage vélos | Verrou de réservation | Utilisé par |
|------|-----------------|-----------------|-------------------------|-------------|
| Mémoire | `false` (défaut) | Tableau JS en mémoire | Champ en mémoire | `npm run dev`, pipeline CI, tests |
| Production | `true` | PostgreSQL | Redis (clé avec expiration `EX`) | `docker compose up` |

Ce découpage évite d'avoir à démarrer PostgreSQL et Redis juste pour lancer les tests unitaires en CI,
tout en démontrant une vraie intégration base de données + cache pour l'exécution "réelle".

```
src/
  config.js                      lecture centralisée des variables d'environnement
  app.js / server.js             application Express et point d'entrée
  routes/bikes.js                 GET /api/bikes
  routes/reservations.js          POST /api/reservations, GET /api/reservations/:id/price
  services/pricing.js             règle de calcul du prix
  repositories/index.js           choisit l'implémentation mémoire ou PostgreSQL/Redis
  repositories/memory/            implémentation en mémoire
  repositories/postgres/          implémentation PostgreSQL + Redis
  db/postgres.js                  pool de connexions PostgreSQL (pg)
  db/redis.js                     client Redis (connexion paresseuse)
  db/init.sql                     schéma + données de test, exécuté au 1er démarrage de PostgreSQL
tests/
  bikes.test.js
  reservations.test.js
.github/workflows/ci.yml          pipeline CI/CD (lint, tests, build, image Docker)
Dockerfile                        image multi-stage de l'API
docker-compose.yml                 API + PostgreSQL + Redis
```

## Démarrage rapide — mode mémoire (local, sans Docker)

```bash
npm install
cp .env.example .env
npm run dev
# API disponible sur http://localhost:3000, données en mémoire (USE_DATABASE=false)
```

```bash
curl http://localhost:3000/api/bikes
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{"bikeId":"bike-01"}'
```

## Démarrage — mode production (PostgreSQL + Redis via Docker Compose)

```bash
docker compose up --build
# API disponible sur http://localhost:3000, USE_DATABASE=true (défini dans docker-compose.yml)
```

Au premier démarrage, PostgreSQL exécute automatiquement `src/db/init.sql`, qui crée les tables
`bikes` / `reservations` et insère les 5 vélos de démonstration. Les mêmes commandes `curl`
ci-dessus fonctionnent alors avec de vraies requêtes SQL et un verrou Redis à expiration automatique.

Pour repartir d'une base vide :

```bash
docker compose down -v   # supprime aussi le volume db_data
```

## Lancer les tests

```bash
npm test
```

Les tests s'exécutent toujours en mode mémoire (`USE_DATABASE` n'est pas positionné dans
l'environnement de test), donc aucune base de données n'est nécessaire pour les faire passer —
y compris dans le pipeline CI.

## Pistes d'amélioration possibles

- Ajouter l'authentification utilisateur (`POST /api/auth/login`).
- Ajouter un endpoint `DELETE /api/reservations/:id` pour annuler une réservation.
- Ajouter des tests d'intégration ciblant explicitement le mode PostgreSQL/Redis (avec des
  conteneurs de test, par exemple via testcontainers).
- Ajouter une CHANGELOG et un versionnage sémantique déclenché automatiquement par le pipeline CI.

## Grille d'évaluation

Voir le support de cours, Module 11, pour la grille d'évaluation complète du mini-projet
(workflow Git, pipeline CI/CD, conteneurisation, déploiement, présentation orale).
