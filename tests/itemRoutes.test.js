process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb");

let popsicle = { name: "popsicle", price: 1.45 };

beforeEach(() => {
    items.push(popsicle);
});

afterEach(() => {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({items: [popsicle]});
    });
});

describe("POST /items", () => {
    test("Add item to list", async () => {
        const res = await request(app).post("/items").send({
            name: "lemon",
            price: .55
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({item: {name: "lemon", price: 0.55}});
    });
    test("Responds with 400 if name or price is missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    });
});

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${popsicle.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({item: popsicle});
    });
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).get("/items/bananna");
        expect(res.statusCode).toBe(404);
    });
});

describe("PATCH /items/:name", () => {
    test("Update an items's name and price", async () => {
        const res = await request(app).patch(`/items/${popsicle.name}`).send({
            name: "icicle", price: 2.21
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: {
            "name": "icicle", "price": 2.21
        }});
    });
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).patch("/items/bananna").send({
            name: "icicle", price: 2.21
        });
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${popsicle.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Deleted"});
        expect(items.length).toEqual(0);
    });
    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/corn}`);
        expect(res.statusCode).toBe(404);
    });
});