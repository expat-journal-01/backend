const express = require("express");

const { authenticate } = require("../auth/authMiddleware");


const router = express.Router();


router.use(authenticate);


// Get all users

router.get("/", (req, res) => {
    res.status(501).send("Not implemented");
});


module.exports = router;