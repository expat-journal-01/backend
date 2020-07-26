const db = require("../../data/dbConfig");


module.exports = {
    getById,
    getAll,
}


function getById (id) {
    return db("story").where({id});
}

function getAll () {
    return db("story");
}