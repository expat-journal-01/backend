exports.up = function(knex) {
    return knex.schema.createTable("story", table => {
        table.increments();
        table.string("title", 80)
            .notNullable();
        table.text("description")
            .nullable();
        table.string("coverImage", 255)
            .nullable();
        table.integer("userId")
            .unsigned()
            .notNullable()
            .references("id")
            .inTable("user")
            .onUpdate("CASCADE")
            .onDelete("CASCADE");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("story");
};