exports.up = function(knex) {
    return knex.schema.createTable("user", table => {
        table.increments();
        table.string("username", 80)
            .notNullable()
            .unique();
        table.string("password", 255)
            .notNullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists("user");
};
