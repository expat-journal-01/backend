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


// Get all stories by user id

router.get("/user/:id", (req, res) => {
    storyDb.getByUserId(req.params.id)
        .then(stories => {
            res.status(200).json(stories);
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not get stories.",
                description: error
            });
        });
});

// Add a story

router.post("/", validateStoryData, (req, res) => {

    const storyData = {
        title: req.body.title,
        description: req.body.description || null,
        coverImage: req.body.coverImage || null,
        userId: req.jwt.id
    };


    storyDb.add(storyData)
        .then(story => {
            res.status(201).json(story);
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not add a story.",
                description: error
            });
        });
});


// Edit a story

router.put("/:id", validateStoryData, async (req, res) => {

    // Find the story
    
    const stories = await storyDb.getById(req.params.id)
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not find a story.",
                description: error
            });
        });




    if (stories.length) {
        // If the story has been created by another user, can't edit
        if (stories[0]["userId"] !== req.jwt.id) {

            res.status(403).json({
                error: "Access denied"
            });

        } else {

            const modifiedStory = Object.assign(stories[0], req.body);

            storyDb.update(req.params.id, modifiedStory)
                .then(stories => {
                    res.status(200).json(stories);
                })
                .catch(error => {
                    res.status(500).json({
                        error: "Server error. Could not find a story.",
                        description: error
                    });
                });
        }
    } else {
        res.status(404).json({
            error: "Not found."
        });
    }
});


// Delete a story and its posts

router.delete("/:id", (req, res) => {
    let deletedStories;

    storyDb.getById(req.params.id)
        .then(stories => {
            if (stories.length) {
                if (stories[0]["userId"] !== req.jwt.id) {
            
                    res.status(403).json({
                        error: "Access denied"
                    });
        
                } else {
                    deletedStories = stories;

                    storyDb.remove(req.params.id)
                        .then(rowsDeleted => {
                            if (rowsDeleted) {
                                res.status(200).json(deletedStories);
                            } else {
                                res.status(404).json({
                                    error: `Not found. Could not delete a story with id ${req.params.id}`
                                });
                            }
                        });
                }
            } else {
                res.status(404).json({
                    error: "Could not delete a story. Not found."
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not delete a story.",
                description: error
            });
        });
});



module.exports = router;