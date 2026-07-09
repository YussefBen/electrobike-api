const { Pool } = require("pg");
const { DATABASE_URL } = require("../config");

// Un seul pool de connexions, réutilisé par tous les repositories PostgreSQL.
const pool = new Pool({ connectionString: DATABASE_URL });

pool.on("error", (err) => {
  console.error("Erreur inattendue sur le pool PostgreSQL :", err);
});

module.exports = pool;
