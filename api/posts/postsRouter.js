const express = require("express");
const { authenticate } = require("../auth/authMiddleware");


const router = express.Router();

// Middleware
router.use(authenticate);


router.get("/", (req, res) => {
    res.status(501).send("Not implemented");
});


router.post("/", (req, res) => {
    res.status(501).send("Not implemented");
});
  


module.exports = router;