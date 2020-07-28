
const userSchema = {
    type: "object",
    strict: true,
    properties: {
        username: { type: 'string', minLength: 3 },
        password: { type: 'string', minLength: 4 }
    }
};


module.exports = userSchema;