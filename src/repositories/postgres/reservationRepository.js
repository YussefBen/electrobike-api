const pool = require("../../db/postgres");

async function create({ id, bikeId, createdAt }) {
  await pool.query(
    "INSERT INTO reservations (id, bike_id, created_at) VALUES ($1, $2, $3)",
    [id, bikeId, new Date(createdAt)]
  );
  return { id, bikeId, createdAt };
}

async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, bike_id AS "bikeId", created_at AS "createdAt" FROM reservations WHERE id = $1',
    [id]
  );
  if (!rows[0]) return null;
  return { ...rows[0], createdAt: new Date(rows[0].createdAt).getTime() };
}

module.exports = { create, findById };
