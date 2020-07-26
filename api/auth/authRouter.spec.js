const request = require("supertest");

const db = require("../../data/dbConfig");
const server = require("../../server");
const { cleanDb } = require("../../data/helpers");


describe("Test register", () => {
    beforeAll(async () => {
        await cleanDb();
    });
    

    afterAll(async () => {
        await cleanDb();
    });



    test("Create a user successfully", async () => {
        const response = await request(server)
            .post("/api/auth/register")
            .send({
                username: "Jamie",
                password: "1234"
            });

        expect(response.status).toBe(201);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]["id"]).toBeTruthy();
    });


    test("Can't create a user with the same username and password", async () => {
        const response = await request(server)
            .post("/api/auth/register")
            .send({
                username: "Jamie",
                password: "1234"
            });

        expect(response.status).toBe(400);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.error).toBeTruthy();
    });


    test("Can't create a user with empty username and password", async () => {
        const response = await request(server)
            .post("/api/auth/register")
            .send({
                username: "",
                password: ""
            });

        expect(response.status).toBe(400);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.error).toBeTruthy();
    });


    test("Can't create a user with missing data", async () => {
        const response = await request(server)
            .post("/api/auth/register")
            .send({});

        expect(response.status).toBe(400);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.error).toBeTruthy();
    });

});


describe("Test login", () => {
    beforeAll(async () => {
        await cleanDb();

        // Create 1 user
        await request(server)
            .post("/api/auth/register")
            .send({
                username: "Jamie",
                password: "1234"
            });
    });
    

    afterAll(async () => {
        await cleanDb();
    });


    test("Can't log in if username is wrong", async () => {
        const response = await request(server)
            .post("/api/auth/login")
            .send({
                username: "Jamieeeeeeee",
                password: "1234"
            });

        expect(response.status).toBe(403);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.token).toBe(undefined);
    });

    test("Can't log in if password is wrong", async () => {
        const response = await request(server)
            .post("/api/auth/login")
            .send({
                username: "Jamie",
                password: "123456"
            });

        expect(response.status).toBe(403);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.token).toBe(undefined);
    });

    
    test("Can't log in using without credentials", async () => {
        const response = await request(server)
            .post("/api/auth/login")
            .send({});

        expect(response.status).toBe(400);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.token).toBe(undefined);
    });


    test("Can't log in using with invalid credentials", async () => {
        const response = await request(server)
            .post("/api/auth/login")
            .send({
                username: "Ja", // less than 3 chars
                password: ""    // less than 4 chars
            });

        expect(response.status).toBe(400);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.token).toBe(undefined);
    });


    test("Can log in using valid credentials", async () => {
        const response = await request(server)
            .post("/api/auth/login")
            .send({
                username: "Jamie",
                password: "1234"
            });

        expect(response.status).toBe(200);
        expect(response.headers["content-type"]).toMatch(/application\/json/);
        expect(response.body.token).toBeTruthy();
    });
    

});
