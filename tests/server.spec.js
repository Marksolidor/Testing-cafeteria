const request = require("supertest");
const server = require("../index");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.TOKEN;

describe("Operaciones CRUD de cafes", () => {
  test("Debería obtener un código 200 y un arreglo con al menos 1 objeto al hacer una petición GET a /cafes", async () => {
    const response = await request(server).get("/cafes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("Debería obtener un código 404 al intentar eliminar un café con un id que no existe", async () => {
    // Generamos un token de prueba
    const token = jwt.sign({ user: "testUser" }, "secretKey");
    // Agregamos el token en la cabecera de la petición
    const response = await request(server)
      .delete("/cafes/12345")
      .set("Authorization", `Bearer ${secret}`);
    expect(response.status).toBe(404);
  });

  test("Debería agregar un nuevo café y devolver un código 201 al hacer una petición POST a /cafes", async () => {
    const newCafe = { id: "12345", name: "Café de prueba" };
    const response = await request(server).post("/cafes").send(newCafe);
    expect(response.status).toBe(201);
    expect(response.body).toContainEqual(newCafe);
  });

  test("Debería devolver un código 400 si intentas actualizar un café enviando un id en los parámetros diferente al id dentro del payload", async () => {
    const updatedCafe = { id: "54321", name: "Café actualizado" };
    const response = await request(server)
      .put("/cafes/12345")
      .send(updatedCafe);
    expect(response.status).toBe(400);
  });
});
