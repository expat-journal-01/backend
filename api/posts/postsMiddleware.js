const inspector = require("schema-inspector");

const postSchema = require("./postSchema");

module.exports = {
    validatePostData
};


function validatePostData (req, res, next) {
    const validationResult = inspector.validate(postSchema, req.body);

    if (validationResult.valid) {
        next();
    } else {
        res.status(400).json({
            error: "Bad request. Please provide valid post data.",
            description: validationResult.error
        });
    }
}