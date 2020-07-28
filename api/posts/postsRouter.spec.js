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


        // Add a story

        const storyData = {
            title: "Sample post",
            description: "Sample description"
        };

        await request(server)
            .post("/api/stories")
            .send(storyData)
            .set("Authorization", authToken);
        
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


    test("Add a post successfully", async (done) => {
        request(server)
            .post("/api/posts")
            .field("title", "Sample title")
            .field("description", "Sample description")
            .field("storyId", 1)
            .attach("image", "api/posts/test_images/small.jpg")
            .set("Authorization", authToken)
            .then((response) => {
                const expected = [
                    {
                        id: 1,
                        title: 'Sample title',
                        description: 'Sample description',
                        image: 'uploads/1595896000124-187187945.jpg',
                        userId: 1,
                        storyId: 1
                    }
                ];

                expect(response.status).toBe(201);
                expect(response.headers["content-type"]).toMatch(/application\/json/);
                expect(response.body[0]["image"]).toBeTruthy();

                done();
            });

        
    });

});