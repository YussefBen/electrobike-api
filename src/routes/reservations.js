const express = require("express");
const { randomUUID } = require("crypto");
const { bikeRepository, reservationRepository } = require("../repositories");
const { estimatePrice } = require("../services/pricing");
const { RESERVATION_DURATION_SEC } = require("../config");

const router = express.Router();

/**
 * POST /api/reservations   body: { bikeId }
 * Verrouille le vélo pendant 5 minutes le temps que l'utilisateur le rejoigne.
 * Correspond à la user story :
 *   "En tant qu'utilisateur, je veux réserver un vélo pendant 5 minutes,
 *    afin d'avoir le temps de le rejoindre avant qu'il ne soit repris."
 */
router.post("/", async (req, res, next) => {
  try {
    const { bikeId } = req.body || {};
    if (!bikeId) {
      return res.status(400).json({ error: "Le champ bikeId est requis" });
    }

    const bike = await bikeRepository.findById(bikeId);
    if (!bike) {
      return res.status(404).json({ error: "Vélo introuvable" });
    }

    const alreadyLocked = await bikeRepository.isLocked(bikeId);
    if (alreadyLocked) {
      return res.status(409).json({ error: "Ce vélo est déjà réservé" });
    }

    await bikeRepository.lock(bikeId, RESERVATION_DURATION_SEC);

    const reservation = await reservationRepository.create({
      id: randomUUID(),
      bikeId,
      createdAt: Date.now(),
    });

    res.status(201).json(reservation);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/reservations/:id/price
 * Estime le prix du trajet en cours à partir de la durée écoulée depuis la réservation.
 * Correspond à la user story :
 *   "En tant qu'utilisateur, je veux consulter le prix estimé avant de démarrer,
 *    afin de connaître le coût de mon trajet."
 */
router.get("/:id/price", async (req, res, next) => {
  try {
    const reservation = await reservationRepository.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: "Réservation introuvable" });
    }

    const durationMinutes = (Date.now() - reservation.createdAt) / 60000;
    const price = estimatePrice(durationMinutes);

    res.json({
      reservationId: reservation.id,
      durationMinutes: Math.round(durationMinutes * 10) / 10,
      price,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
