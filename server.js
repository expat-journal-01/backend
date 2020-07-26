const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRouter = require("./api/auth/authRouter");
const postsRouter = require("./api/posts/postsRouter");
const storiesRouter = require("./api/stories/storiesRouter");
const { validateUserData, authenticate } = require("./api/auth/authMiddleware");


const server = express();


server.use(helmet());
server.use(cors());
server.use(express.json());


server.use("/api/auth", validateUserData, authRouter);
server.use("/api/posts", authenticate, postsRouter);
server.use("/api/stories", authenticate, storiesRouter);


module.exports = server;