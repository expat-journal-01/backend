const db = require("../../data/dbConfig");

const TABLE_NAME = "story";


module.exports = {
    getById,
    getAll,
    add,
    update,
    remove,
    getByUserId
}


function getById (id) {
    return db(TABLE_NAME).where({id});
}


function getByUserId (userId) {
    return db("story")
        .join("user", "user.id", "=", "story.userId")
        .where({userId})
        .select(
            "story.id",
            "story.title",
            "story.description",
            "story.coverImage",
            "story.userId"
        );
}


function getAll () {
    return db(TABLE_NAME);
}


function add (storyData) {
    return db(TABLE_NAME)
        .returning("id")
        .insert(storyData)
        .then(ids => {
            return getById(ids[0]);
        });
}


function update (id, storyData) {
    return db(TABLE_NAME)
        .where({id})
        .update(storyData)
        .then(rows => {
            return getById(id);
        });
}


function remove (id) {
    return db(TABLE_NAME)
        .where({id})
        .del();
}