const db = require("../../data/dbConfig");

const TABLE_NAME = "post";


module.exports = {
    getById,
    getAll,
    add
};


function getById (id) {
    return db(TABLE_NAME).where({id});
}


function getAll () {
    return db(TABLE_NAME);
}


function add (postData) {
    return db(TABLE_NAME)
        .returning("id")
        .insert(postData)
        .then(ids => {
            return getById(ids[0]);
        });
}