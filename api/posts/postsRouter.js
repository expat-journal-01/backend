const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");


const { authenticate } = require("../auth/authMiddleware");
const storyDb = require("../stories/storyModel");
const postDb = require("./postModel");
const { isPostDataValid, removeImage } = require("./postsHelpers");


// Multer config

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_TEMP_PATH)
    },
    
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer(
    {
        storage: storage,
        fileFilter: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            if(ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
                req.invalidExtension = true;
                return cb(null, false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 4 * 1024 * 1024 // max 5 MB
        }
    }
);


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
    postDb.getByUserId(req.params.id)
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


// Get all posts by storyId

router.get("/story/:id", (req, res) => {
    postDb.getByStoryId(req.params.id)
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


// Get a post by id

router.get("/:id", (req, res) => {
    postDb.getById(req.params.id)
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


// Add a post

router.post("/", upload.single("image"), async (req, res) => {

    // Check incoming data

    if (!req.file || req.invalidExtension || !isPostDataValid(req.body)) {
        return res.status(400).json({
            error: "Bad request. Please provide valid data"
        });
    }

    // Find a story

    const stories = await storyDb.getById(req.body.storyId)
        .catch(error => {
            return res.status(500).json({
                error: "Server error. Could not get a story.",
                description: error
            });
        });


    // If story exists

    if (stories.length) {

        if (stories[0]["userId"] !== req.jwt.id) {

            return res.status(403).json({
                error: "Access denied. Can't add a post to a story of another user."
            });
        }
        
        const postData = {
            title: req.body.title,
            description: req.body.description || null,
            image: path.join(process.env.UPLOAD_PATH, req.file.filename),
            storyId: req.body.storyId,
            userId: req.jwt.id
        };


        // Move the file from tmp to uploads

        fs.rename(
            path.join(process.env.UPLOAD_TEMP_PATH, req.file.filename),
            path.join(process.env.UPLOAD_PATH, req.file.filename),
            (err) => {
                if (err) throw err;
            }
        );

        postDb.add(postData)
            .then(posts => {
                return res.status(201).json(posts);
            })
            .catch(error => {
                return res.status(500).json({
                    error: "Server error. Could not add a post.",
                    description: error
                });
            });


        // Update image url in story

        storyDb.update(req.body.storyId, { coverImage: path.join(process.env.UPLOAD_PATH, req.file.filename) })
            .catch(error => {
                return res.status(500).json({
                    error: "Server error. Could not update story image.",
                    description: error
                });
            });
    } else {
        return res.status(404).json({
            error: `Not found. Could not find a story with id ${req.body.storyId}.`
        });
    }
    
});


// Edit a post

router.put("/:id", (req, res) => {
    res.status(501).send("Not implemented");
});


// Delete a post

router.delete("/:id", async (req, res) => {

    const posts = await postDb.getById(req.params.id)
        .catch(error => {
            return res.status(500).json({
                error: "Server error. Could not get a story.",
                description: error
            });
        });


    if (posts.length) {

        if (posts[0]["userId"] !== req.jwt.id) {
            
            return res.status(403).json({
                error: "Access denied. Can't delete a post of another user."
            });
        }

        const deletedPost = posts[0];

        // Delete the post
        await postDb.remove(req.params.id)
            .catch(error => {
                return res.status(500).json({
                    error: "Server error. Could not remove a post.",
                    description: error
                });
            });

        // Get the rest of the posts in that story
        const allStoryPosts = await postDb.getByStoryId(deletedPost.storyId)
            .catch(error => {
                return res.status(500).json({
                    error: "Server error. Could not get a story.",
                    description: error
                });
            });

        if (allStoryPosts.length) {

            // Set story's coverImage to the image of the latest post
            const lastPost = allStoryPosts[allStoryPosts.length - 1];
            storyDb.update(deletedPost.storyId, { coverImage: lastPost.image });

        } else {
            // That wa the last post! So set coverImage to null
            storyDb.update(deletedPost.storyId, { coverImage: null });
        }

        removeImage(deletedPost.image);

        // Respond with the deleted post

        return res.status(200).json(deletedPost);

    } else {
        return res.status(404).json({
            error: `Not found. Post with id ${req.params.id} doesn't exist.`
        });
    }
    
});


module.exports = router;