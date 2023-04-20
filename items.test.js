process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("./app");
let items = require("./fakeDb");
let item = {name: "banana", price:100}

beforeEach(async() => {
    items.push(item);
});

afterEach(async() => {
    items.length = 0;
});

//test all items route
describe("Get /items", async function(){
    test("Get list of items", async function(){
        const resp = await request(app).get('/items');
        const {items} = resp.body;
        expect(resp.statusCode).toBe(200);
        expect(items).toHaveLength(1);
    });
});

//test specific item page
describe("Get /items/:name", async function(){
    test("Get a specific item", async function(){
        const resp = await request(app).get(`/items/${item.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item).toEqual(item);
    });
    test("Respond with 404 if item not found", async function(){
        const resp = await request(app).get(`/items/uibycwecq`);
        expect(resp.statusCode).toBe(404);
    });
});

//test add item page
describe("Post /items/", async function(){
    test("Creates a new item", async function(){
        const resp = await request(app).post(`/items`).send({
            name:"apple",
            price:150
        });
        expect(resp.statusCode).toBe(200);
        expect(resp.body.item).toHaveProperty("name");
        expect(resp.body.item).toHaveProperty("price");
        expect(resp.body.item.name).toEqual("apple");
        expect(resp.body.item.price).toEqual(150);
    });
});

//test updating an item
describe("Patch /items/:name", async function () {
    test("Updates a single item", async function () {
        const response = await request(app).patch(`/items/${item.name}`)
            .send({
                name: "watermelon"
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toEqual({
            name: "watermelon"
        });
    });
  
    test("Responds with 404 if can't find item", async function () {
      const response = await request(app).patch(`/items/nwinvrubf;av`);
      expect(response.statusCode).toBe(404);
    });
});

//test deleting an item
describe("DELETE /items/:name", async function () {
    test("Deletes a single a item", async function () {
        const response = await request(app).delete(`/items/${item.name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Deleted" });
    });
});