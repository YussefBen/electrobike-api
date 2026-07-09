const request = require("supertest");
const app = require("../src/app");

describe("POST /api/reservations", () => {
  it("crée une réservation pour un vélo disponible", async () => {
    const res = await request(app).post("/api/reservations").send({ bikeId: "bike-01" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.bikeId).toBe("bike-01");
  });

  it("refuse de réserver un vélo déjà réservé", async () => {
    await request(app).post("/api/reservations").send({ bikeId: "bike-02" });
    const res = await request(app).post("/api/reservations").send({ bikeId: "bike-02" });
    expect(res.status).toBe(409);
  });

  it("refuse un vélo inexistant", async () => {
    const res = await request(app).post("/api/reservations").send({ bikeId: "bike-inconnu" });
    expect(res.status).toBe(404);
  });

  it("refuse une requête sans bikeId", async () => {
    const res = await request(app).post("/api/reservations").send({});
    expect(res.status).toBe(400);
  });
});

describe("GET /api/reservations/:id/price", () => {
  it("calcule un prix estimé pour une réservation existante", async () => {
    const createRes = await request(app).post("/api/reservations").send({ bikeId: "bike-04" });
    const { id } = createRes.body;

    const priceRes = await request(app).get(`/api/reservations/${id}/price`);
    expect(priceRes.status).toBe(200);
    expect(priceRes.body).toHaveProperty("price");
    expect(priceRes.body.price).toBeGreaterThanOrEqual(1.0); // au moins le forfait de base
  });

  it("renvoie une erreur 404 pour une réservation inconnue", async () => {
    const res = await request(app).get("/api/reservations/id-inexistant/price");
    expect(res.status).toBe(404);
  });
});
