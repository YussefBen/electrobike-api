// Configuration centralisée de l'application, lue une seule fois au démarrage.
//
// USE_DATABASE bascule entre les deux modes de fonctionnement de cette solution :
//   - false (par défaut) : les données vivent en mémoire. C'est le mode utilisé par
//     `npm run dev` en local et par le pipeline CI (aucune base externe requise).
//   - true : les vélos sont lus depuis PostgreSQL et les verrous de réservation
//     depuis Redis. C'est le mode utilisé par `docker compose up`.

const USE_DATABASE = process.env.USE_DATABASE === "true";

module.exports = {
  PORT: process.env.PORT || 3000,
  USE_DATABASE,
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
  MIN_BATTERY: 20, // %, cf. critère d'acceptation défini au Module 5 du support de cours
  RESERVATION_DURATION_SEC: 5 * 60, // 5 minutes, cf. Sprint Goal du Module 5
};
