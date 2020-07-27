const express = require("express");

const postDb = require("./postModel");
const { authenticate } = require("../auth/authMiddleware");
const { validatePostData } = require("./postsMiddleware");


const router = express.Router();


// Middleware
router.use(authenticate);


// Get all posts

router.get("/", (req, res) => {
    postDb.getAll()
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not get all posts.",
                description: error
            });
        });
});


// Get all posts by user id

router.get("/user/:id", (req, res) => {
    res.status(501).send("Not implemented");
});


// Get a post by id

router.get("/:id", (req, res) => {
    res.status(501).send("Not implemented");
});


// Add a post

router.post("/", validatePostData, (req, res) => {
    res.status(501).send("Not implemented");
});


// Edit a post

router.put("/:id", validatePostData, (req, res) => {
    res.status(501).send("Not implemented");
});


// Delete a post

router.delete("/:id", (req, res) => {
    res.status(501).send("Not implemented");
});


module.exports = router;