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

    
    test("No stories yet", async () => {
        const response = await request(server).get("/api/stories").set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toMatchObject([]);
    });


    test("Add a story", async () => {
        const storyData = {
            title: "Sample post",
            description: "Sample description"
        };

        const response = await request(server)
            .post("/api/stories")
            .send(storyData)
            .set("Authorization", authToken);

        const expected = [
            {
                id: 1,
                userId: 1,
                title: "Sample post",
                description: "Sample description"
            }
        ];
        
        expect(response.status).toBe(201);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toMatchObject(expected);
    });

    test("Edit a story", async () => {
        modifiedStoryData = {
            title: "Changed title",
            description: "Changed description",
        }

        const expected = [
            {
                id: 1,
                title: "Changed title",
                description: "Changed description",
                coverImage: null,
                userId: 1
            }
        ];

        const response = await request(server)
            .put("/api/stories/1")
            .set("Authorization", authToken)
            .send(modifiedStoryData);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toEqual(expected);
    });


    test("Get all stories", async () => {
        const response = await request(server).get("/api/stories").set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toHaveLength(1);
    });


    test("Delete a story", async () => {
        const response = await request(server).del("/api/stories/1").set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toMatchObject([]);
    });


    test("No stories left", async () => {
        const response = await request(server).get("/api/stories").set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toMatchObject([]);
    });

});