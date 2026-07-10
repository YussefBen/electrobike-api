const express = require("express");
const { bikeRepository } = require("../repositories");
const { MIN_BATTERY } = require("../config");

const router = express.Router();

/**
 * GET /api/bikes
 * Retourne uniquement les vélos disponibles : batterie suffisante et non réservés.
 * Correspond à la user story :
 *   "En tant qu'utilisateur, je veux voir sur une carte les vélos disponibles
 *    autour de moi, afin de choisir le plus proche."
 * Ajout d'un commentaire test pour l'exécution d'un build
 */
router.get("/", async (req, res, next) => {
  try {
    const bikes = await bikeRepository.findAvailable(MIN_BATTERY);
    res.json(bikes);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
