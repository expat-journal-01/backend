exports.up = function(knex) {
    return knex.schema.createTable("post", table => {
        table.increments();
        table.string("title", 80)
            .notNullable();
        table.text("description")
            .nullable();
        table.string("image", 255)
            .notNullable();
        table.integer("userId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("user")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
        table.integer("storyId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("story")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("post");
};