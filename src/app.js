const express = require("express");
const bikesRouter = require("./routes/bikes");
const reservationsRouter = require("./routes/reservations");

const app = express();
app.use(express.json());

// Utilisé par la plateforme de déploiement (Module 10) pour vérifier que l'API est en vie.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/bikes", bikesRouter);
app.use("/api/reservations", reservationsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Middleware d'erreur centralisé : toute erreur passée à next(err) dans les
// routes (échec PostgreSQL/Redis, etc.) atterrit ici plutôt que de faire planter le process.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

module.exports = app;
