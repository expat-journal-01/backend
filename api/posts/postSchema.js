
const postSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            minLength: 2,
            maxLength: 80
        },
        description: {
            type: "string",
            optional: true
        },
        postId: {
            type: "integer"
        }
    }
};

module.exports = postSchema;