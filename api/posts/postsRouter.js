const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");


const { authenticate } = require("../auth/authMiddleware");
const storyDb = require("../stories/storyModel");
const postDb = require("./postModel");
const { isPostDataValid } = require("./postsHelpers");


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

        storyDb.update(req.body.storyId, { coverImage: req.file.path })
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

router.delete("/:id", (req, res) => {
    res.status(501).send("Not implemented");
});


module.exports = router;