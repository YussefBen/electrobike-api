// Règle de tarification du mini-projet (volontairement simple) :
//   - un forfait de déverrouillage fixe
//   - un tarif à la minute au-delà

const BASE_FARE = 1.0; // prix de déverrouillage, en euros
const PRICE_PER_MINUTE = 0.15; // euros par minute d'utilisation

/**
 * Calcule le prix estimé d'un trajet.
 * @param {number} durationMinutes - durée du trajet en minutes (doit être >= 0)
 * @returns {number} prix arrondi à 2 décimales
 */
function estimatePrice(durationMinutes) {
  if (durationMinutes < 0) {
    throw new Error("La durée doit être positive");
  }
  const price = BASE_FARE + durationMinutes * PRICE_PER_MINUTE;
  return Math.round(price * 100) / 100;
}

module.exports = { estimatePrice, BASE_FARE, PRICE_PER_MINUTE };
