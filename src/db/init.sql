-- Exécuté automatiquement par l'image officielle postgres au premier démarrage
-- du conteneur (dossier /docker-entrypoint-initdb.d), cf. docker-compose.yml.

CREATE TABLE IF NOT EXISTS bikes (
  id       VARCHAR(20) PRIMARY KEY,
  lat      DOUBLE PRECISION NOT NULL,
  lng      DOUBLE PRECISION NOT NULL,
  battery  INT NOT NULL CHECK (battery BETWEEN 0 AND 100)
);

CREATE TABLE IF NOT EXISTS reservations (
  id         UUID PRIMARY KEY,
  bike_id    VARCHAR(20) NOT NULL REFERENCES bikes(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO bikes (id, lat, lng, battery) VALUES
  ('bike-01', 48.8566, 2.3522, 82),
  ('bike-02', 48.8606, 2.3376, 45),
  ('bike-03', 48.8529, 2.3499, 15), -- batterie < 20 % : jamais renvoyé par l'API
  ('bike-04', 48.8580, 2.2945, 90),
  ('bike-05', 48.8462, 2.3372, 60)
ON CONFLICT (id) DO NOTHING;
