const bcrypt = require("bcryptjs");
const db = require("../../data/dbConfig");

const TABLE_NAME = "user";


module.exports = {
    getById,
    register,
    getByUsername
};


function getById (id) {
    return db(TABLE_NAME).select("id", "username").where({id});
}


// ! Response contains password !
function getByUsername (username) {
    return db(TABLE_NAME).where({username});
}


function register (userData) {
    const hashedPassword = bcrypt.hashSync(userData.password, 8);

    return db(TABLE_NAME).insert(
        {
            username: userData.username,
            password: hashedPassword
        },
        "id"
    )
    .then(ids => {
        return getById(ids[0]);
    });
}