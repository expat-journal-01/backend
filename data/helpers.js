const cleaner = require("knex-cleaner");
const db = require("./dbConfig");

module.exports = {
    cleanDb
};

async function cleanDb () {
    await cleaner.clean(db, {
        mode: "truncate",
        restartIdentity: true,
        ignoreTables: ["knex_migrations", "knex_migrations_lock"]
    });
}