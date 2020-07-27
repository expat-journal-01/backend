const express = require("express");
const multer = require("multer");
const path = require("path");

const { authenticate } = require("../auth/authMiddleware");
const storyDb = require("../stories/storyModel");
const postDb = require("./postModel");
const { isPostDataValid } = require("./postsHelpers");


// Multer config

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH)
    },
    
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
    fileSize: 5 * 1024 * 1024 // max 5 MB
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
    res.status(501).send("Not implemented");
});


// Get a post by id

router.get("/:id", (req, res) => {
    res.status(501).send("Not implemented");
});


// Add a post

router.post("/", upload.single("image"), async (req, res) => {

    // Check incoming data

    if (!req.file || req.invalidExtension || !isPostDataValid(req.body)) {
        res.status(400).json({
            error: "Bad request. Please provide valid data"
        });
    }

    // Find a story

    const stories = await storyDb.getById(req.body.storyId)
        .catch(error => {
            res.status(500).json({
                error: "Server error. Could not get a story.",
                description: error
            });
        });

    // If story exists

    if (stories.length) {
        const postData = {
            title: req.body.title,
            description: req.body.description || null,
            image: req.file.path,
            storyId: req.body.storyId,
            userId: req.jwt.id
        };

        postDb.add(postData)
            .then(posts => {
                res.status(200).json(posts);
            })
            .catch(error => {
                res.status(500).json({
                    error: "Server error. Could not add a post.",
                    description: error
                });
            });


        // Update image url in story

        storyDb.update(req.body.storyId, { coverImage: req.file.path })
            .catch(error => {
                res.status(500).json({
                    error: "Server error. Could not update story image.",
                    description: error
                });
            });
    } else {
        res.status(404).json({
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