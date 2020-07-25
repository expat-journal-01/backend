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
    userDb.getByUsername(req.body.username)
        .then(users => {

            if (
                users.length &&
                bcrypt.compareSync(req.body.password, users[0]["password"])
            ) {
                const token = jwt.sign(
                    {
                        id: users[0]["id"],
                        username: users[0]["username"]
                    },
                    process.env.SECRET,
                    {
                        expiresIn: "1d"
                    }
                );

                res.status(200).json({
                    token
                });
            } else {
                res.status(403).json({
                    error: "Wrong username or password.",
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not log in.",
                description: error
            });
        });
});


module.exports = router;