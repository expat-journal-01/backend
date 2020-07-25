const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRouter = require("./api/auth/authRouter");
const { validateUserData } = require("./api/auth/authMiddleware");


const server = express();


server.use(helmet());
server.use(cors());
server.use(express.json());


server.use("/api/auth", validateUserData, authRouter);


module.exports = server;