const db = require("../../data/dbConfig");

const TABLE_NAME = "story";


module.exports = {
    getById,
    getAll,
    add
}


function getById (id) {
    return db(TABLE_NAME).where({id});
}

function getAll () {
    return db(TABLE_NAME);
}

function add (storyData) {
    return db(TABLE_NAME).returning('id')
        .insert(storyData)
        .then(ids => {
            return getById(ids[0]);
        });
}