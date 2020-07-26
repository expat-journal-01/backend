const express = require("express");


const router = express.Router();


// Add a story

router.post("/", (req, res) => {
    res.status(501).send("Not implemented");
});


// Get all stories (no posts inside)

router.get("/", (req, res) => {
    res.status(501).send("Not implemented");
});


// Edit a story

router.put("/:id", (req, res) => {
    res.status(501).send("Not implemented");
});


// Delete a story and its posts

router.delete("/:id", (req, res) => {
    res.status(501).send("Not implemented");
});



module.exports = router;