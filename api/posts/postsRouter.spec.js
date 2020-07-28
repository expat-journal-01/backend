const request = require("supertest");
const fs = require("fs");
const path = require("path");

const server = require("../../server");
const { cleanDb } = require("../../data/helpers");


async function removeAllUploads () {
    const directory = "uploads";

    fs.readdir(directory, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
            });
        }
    });
}


let authToken;

describe("Stories", () => {
    beforeAll(async () => {
        await cleanDb();
        await removeAllUploads();

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
        await removeAllUploads();
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
            .attach("image", "api/posts/test/small.jpg")
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

    test("Can upload images only", async (done) => {
        request(server)
            .post("/api/posts")
            .field("title", "Sample title")
            .field("description", "Sample description")
            .field("storyId", 1)
            .attach("image", "api/posts/test/dummy.txt")
            .set("Authorization", authToken)
            .then((response) => {
                
                expect(response.status).toBe(400);
                expect(response.headers["content-type"]).toMatch(/application\/json/);
                expect(response.body.error).toBeTruthy();

                done();
            });
    });


    test("Get all posts. 1 present", async () => {
        const response = await request(server)
            .get("/api/posts")
            .set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toHaveLength(1);
    });


    test("Get a post by id", async () => {
        const response = await request(server)
            .get("/api/posts/1")
            .set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toHaveLength(1);
    });


    test("Get a post by userId", async () => {
        const response = await request(server)
            .get("/api/posts/user/1")
            .set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toHaveLength(1);
    });

    test("Get a post by storyId", async () => {
        const response = await request(server)
            .get("/api/posts/story/1")
            .set("Authorization", authToken);

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toHaveLength(1);
    });

});