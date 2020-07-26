
const storySchema = {
    type: "object",
    strict: true,
    properties: {
        title: {
            type: 'string',
            minLength: 3,
            maxLength: 80
        },
        description: {
            type: 'string',
            optional: true
        },
        coverImage: {
            type: 'string',
            optional: true
        }
    }
};


module.exports = storySchema;