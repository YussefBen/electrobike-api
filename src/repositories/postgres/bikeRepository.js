// Implémentation réelle : les vélos sont lus dans PostgreSQL, et la disponibilité
// (verrou de réservation) est gérée dans Redis avec une expiration automatique
// (TTL), exactement comme décrit au Module 9 du support de cours.

const pool = require("../../db/postgres");
const { getRedisClient } = require("../../db/redis");

const LOCK_PREFIX = "bike:reserved:";

async function findAvailable(minBattery) {
  const { rows } = await pool.query(
    "SELECT id, lat, lng, battery FROM bikes WHERE battery >= $1 ORDER BY id",
    [minBattery]
  );

  const redis = await getRedisClient();
  const available = [];
  for (const bike of rows) {
    const isLockedInRedis = await redis.get(`${LOCK_PREFIX}${bike.id}`);
    if (!isLockedInRedis) available.push(bike);
  }
  return available;
}

async function findById(id) {
  const { rows } = await pool.query(
    "SELECT id, lat, lng, battery FROM bikes WHERE id = $1",
    [id]
  );
  return rows[0] || null;
}

async function isLocked(id) {
  const redis = await getRedisClient();
  const value = await redis.get(`${LOCK_PREFIX}${id}`);
  return !!value;
}

async function lock(id, ttlSeconds) {
  const redis = await getRedisClient();
  // EX pose une expiration automatique sur la clé : le verrou disparaît tout
  // seul au bout de 5 minutes, sans tâche de nettoyage à écrire.
  await redis.set(`${LOCK_PREFIX}${id}`, "1", { EX: ttlSeconds });
}

module.exports = { findAvailable, findById, isLocked, lock };
