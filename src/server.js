require("dotenv").config();
const app = require("./app");
const { PORT, USE_DATABASE } = require("./config");

app.listen(PORT, () => {
  const mode = USE_DATABASE ? "PostgreSQL + Redis" : "mémoire (dev/test)";
  console.log(`ElectroBike API démarrée sur le port ${PORT} — mode : ${mode}`);
});
