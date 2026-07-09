const { createClient } = require("redis");
const { REDIS_URL } = require("../config");

const client = createClient({ url: REDIS_URL });
client.on("error", (err) => console.error("Erreur Redis :", err));

let connectPromise = null;

// Connexion paresseuse : le client ne se connecte qu'à la première utilisation,
// et une seule fois même si plusieurs requêtes arrivent en parallèle au démarrage.
async function getRedisClient() {
  if (!client.isOpen) {
    connectPromise = connectPromise || client.connect();
    await connectPromise;
  }
  return client;
}

module.exports = { getRedisClient };
