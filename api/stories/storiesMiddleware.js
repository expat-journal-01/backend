const inspector = require("schema-inspector");

const storySchema = require("./storySchema");

module.exports = {
    validateStoryData
};

function validateStoryData (req, res, next) {
    const validationResult = inspector.validate(storySchema, req.body);

    if (validationResult.valid) {
        next();
    } else {
        res.status(400).json({
            error: "Bad request. Please provide valid story data.",
            description: validationResult.error
        });
    }
}