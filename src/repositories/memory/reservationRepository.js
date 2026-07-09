const reservations = new Map();

async function create(reservation) {
  reservations.set(reservation.id, reservation);
  return reservation;
}

async function findById(id) {
  return reservations.get(id) || null;
}

module.exports = { create, findById };
