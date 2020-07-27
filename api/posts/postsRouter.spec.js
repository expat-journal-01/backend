const request = require("supertest");

const db = require("../../data/dbConfig");
const server = require("../../server");
const { cleanDb } = require("../../data/helpers");


let authToken;

describe("Stories", () => {
    beforeAll(async () => {
        await cleanDb();

        // Create a user
        await request(server)
            .post("/api/auth/register")
            .send({
                username: "Mark",
                password: "1234"
            });

        // Login
        const loginResponse = await request(server)
            .post("/api/auth/login")
            .send({
                username: "Mark",
                password: "1234"
            });
        
        // Save the token
        authToken = loginResponse.body.token;
        
    });

    afterAll(async () => {
        await cleanDb();
    });


    test("No posts yet", async () => {
        const response = await request(server)
            .get("/api/posts")
            .set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toMatchObject([]);
    });

    test("Can't add a post with no data", async () => {
        const response = await request(server)
            .post("/api/posts")
            .set("Authorization", authToken);

        expect(response.status).toBe(400);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.error).toBeTruthy();
    });


    test("Can't edit a post with no data", async () => {
        const response = await request(server)
            .put("/api/posts/1")
            .set("Authorization", authToken);

        expect(response.status).toBe(400);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.error).toBeTruthy();
    });

});