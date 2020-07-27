const request = require("supertest");

const server = require("../../server");
const { cleanDb } = require("../../data/helpers");

let authToken;

describe("Test users", () => {
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


    test("Can't read users when unauthorized", async () => {
        const response = await request(server).get("/api/users");

        expect(response.status).toBe(401);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.error).toBeTruthy();
    });


    test("Can read users when authorized", async () => {
        const response = await request(server)
            .get("/api/users")
            .set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toHaveLength(1);
    });


    test("Doesn't reveal password", async () => {
        const response = await request(server)
            .get("/api/users")
            .set("Authorization", authToken);

        expect(response.body[0]["password"]).toBeFalsy();
    });

});