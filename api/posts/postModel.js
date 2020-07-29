const db = require("../../data/dbConfig");

const TABLE_NAME = "post";


module.exports = {
    getById,
    getAll,
    add,
    getByUserId,
    getByStoryId,
    remove,
    update
};


function getById (id) {
    return db(TABLE_NAME).where({id});
}


function getByUserId (userId) {
    return db("post")
        .select(
            "post.id",
            "post.title",
            "post.description",
            "post.image",
            "post.userId",
            "post.storyId"
        )
        .join("user", "user.id", "=", "post.userId")
        .where("user.id", userId);
}


function getByStoryId (storyId) {
    return db("post")
        .select(
            "post.id",
            "post.title",
            "post.description",
            "post.image",
            "post.userId",
            "post.storyId"
        )
        .join("story", "story.id", "=", "post.storyId")
        .where("story.id", storyId);
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


function remove (id) {
    return db(TABLE_NAME)
        .where({id})
        .del();
}


function update (id, postData) {
    return db(TABLE_NAME)
        .where({id})
        .update(postData)
        .then(rows => {
            return getById(id);
        });
}