
// on post edit

const postSchema = {
    type: "object",
    strict: true,
    properties: {
        title: {
            type: "string",
            minLength: 2,
            maxLength: 80,
            optional: true
        },
        description: {
            type: "string",
            optional: true
        }
    }
};

module.exports = postSchema;