const db = require("../../data/dbConfig");

const TABLE_NAME = "post";


module.exports = {
    getById,
    getAll
};


function getById (id) {
    return db(TABLE_NAME).where({id});
}


function getAll () {
    return db(TABLE_NAME);
}
