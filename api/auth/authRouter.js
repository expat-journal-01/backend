const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userDb = require("./userModel");
const { checkUsernameUnique } = require("./authMiddleware");


const router = express.Router();


router.post("/register", checkUsernameUnique, (req, res) => {
    userDb.register({
        username: req.body.username,
        password: req.body.password
    })
    .then(user => {
        res.status(201).json(user);
    })
    .catch(error => {
        res.status(500).json({
            error: "Server error. Could not register a user.",
            description: error
        });
    });
});


router.post("/login", (req, res) => {
    res.status(501).json({
        error: "Not implemented"
    });
});


module.exports = router;