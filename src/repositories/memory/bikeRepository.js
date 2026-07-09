// Implémentation en mémoire : utilisée quand USE_DATABASE=false (mode par défaut),
// notamment en local avec `npm run dev` et dans le pipeline CI (aucune base requise).

const bikes = [
  { id: "bike-01", lat: 48.8566, lng: 2.3522, battery: 82, reservedUntil: null },
  { id: "bike-02", lat: 48.8606, lng: 2.3376, battery: 45, reservedUntil: null },
  { id: "bike-03", lat: 48.8529, lng: 2.3499, battery: 15, reservedUntil: null },
  { id: "bike-04", lat: 48.8580, lng: 2.2945, battery: 90, reservedUntil: null },
  { id: "bike-05", lat: 48.8462, lng: 2.3372, battery: 60, reservedUntil: null },
];

async function findAvailable(minBattery) {
  const now = Date.now();
  return bikes
    .filter((b) => b.battery >= minBattery && (!b.reservedUntil || b.reservedUntil < now))
    .map(({ reservedUntil, ...bike }) => bike); // ne pas exposer le détail interne du verrou
}

async function findById(id) {
  const bike = bikes.find((b) => b.id === id);
  if (!bike) return null;
  const { reservedUntil, ...rest } = bike;
  return rest;
}

async function isLocked(id) {
  const bike = bikes.find((b) => b.id === id);
  return !!(bike && bike.reservedUntil && bike.reservedUntil > Date.now());
}

async function lock(id, ttlSeconds) {
  const bike = bikes.find((b) => b.id === id);
  if (bike) bike.reservedUntil = Date.now() + ttlSeconds * 1000;
}

module.exports = { findAvailable, findById, isLocked, lock };
