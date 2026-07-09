// Point d'entrée unique pour accéder aux données : les routes ne savent jamais
// si elles parlent à la mémoire ou à PostgreSQL/Redis, elles appellent juste
// bikeRepository.findAvailable(), etc. C'est le pattern Repository.

const { USE_DATABASE } = require("../config");

const bikeRepository = USE_DATABASE
  ? require("./postgres/bikeRepository")
  : require("./memory/bikeRepository");

const reservationRepository = USE_DATABASE
  ? require("./postgres/reservationRepository")
  : require("./memory/reservationRepository");

module.exports = { bikeRepository, reservationRepository };
