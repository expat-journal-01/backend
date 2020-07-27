
const postSchema = {
    type: "object",
    strict: true,
    properties: {
        title: {
            type: "string",
            minLength: 3,
            maxLength: 80
        },
        description: {
            type: "string",
            optional: true
        },
        image: {
            type: "string",
            maxLength: 255
        },
        storyId: {
            type: "number"
        }
    }
};


module.exports = postSchema;