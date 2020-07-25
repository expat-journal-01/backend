const jwt = require("jsonwebtoken");

const inspector = require("schema-inspector");
const userSchema = require("./userSchema");
const userDb = require("./userModel");


module.exports = {
    validateUserData,
    checkUsernameUnique,
    authenticate
};


function validateUserData (req, res, next) {
    const validationResult = inspector.validate(userSchema, req.body);

    if (validationResult.valid) {
        next();
    } else {
        res.status(400).json({
            error: "Bad request. Please provide valid username and password.",
            description: validationResult.error
        });
    }
}

async function checkUsernameUnique (req, res, next) {
    const userFound = await userDb.getByUsername(req.body.username);

    if (userFound.length === 0) {
        next();
    } else {
        res.status(400).json({
            error: "User exists. Please provide another username."
        });
    }
}

function authenticate (req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, process.env.SECRET, (error, decodedToken) => {
            if (!error) {
                req.jwt = decodedToken;
                next();
            } else {
                res.status(403).json({
                    error: "Access denied"
                });
            }
        });
    } else {
        res.status(401).json({
            error: "Unauthorized. Please provide valid token."
        });
    }
}