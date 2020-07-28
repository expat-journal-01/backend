const express = require("express");

const userDb = require("./userModel");
const { authenticate } = require("../auth/authMiddleware");


const router = express.Router();


router.use(authenticate);


// Get all users

router.get("/", (req, res) => {
    userDb.getAll()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not get users.",
                description: error
            });
        });
});


// Get a user by id

router.get("/:id", (req, res) => {
    userDb.getById(req.params.id)
        .then(users => {
            res.status(200).json(users);
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not get users.",
                description: error
            });
        });
});


module.exports = router;