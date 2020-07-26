const express = require("express");

const storyDb = require("./storyModel");
const { authenticate } = require("../auth/authMiddleware");
const { validateStoryData } = require("./storiesMiddleware");


const router = express.Router();

// Middleware
router.use(authenticate);


// Get all stories (no posts inside)

router.get("/", (req, res) => {
    storyDb.getAll()
        .then(stories => {
            res.status(200).json(stories);
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not get all stories.",
                description: error
            });
        });
});


// Add a story

router.post("/", validateStoryData, (req, res) => {
    res.status(501).send("Not implemented");
});


// Edit a story

router.put("/:id", validateStoryData, (req, res) => {
    res.status(501).send("Not implemented");
});


// Delete a story and its posts

router.delete("/:id", (req, res) => {
    res.status(501).send("Not implemented");
});



module.exports = router;