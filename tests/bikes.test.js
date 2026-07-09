const request = require("supertest");
const app = require("../src/app");

describe("GET /api/bikes", () => {
  it("renvoie un tableau", async () => {
    const res = await request(app).get("/api/bikes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("ne renvoie que des vélos avec au moins 20% de batterie", async () => {
    const res = await request(app).get("/api/bikes");
    res.body.forEach((bike) => {
      expect(bike.battery).toBeGreaterThanOrEqual(20);
    });
  });

  it("exclut le vélo bike-03 dont la batterie est trop faible", async () => {
    const res = await request(app).get("/api/bikes");
    const ids = res.body.map((bike) => bike.id);
    expect(ids).not.toContain("bike-03");
  });
});
