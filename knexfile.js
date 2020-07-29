require("dotenv").config();

module.exports = {
    development: {
        client: "pg",
        connection: {
            database: process.env.DB_NAME,
            user:     process.env.DB_USER,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./data/migrations"
        },
        seeds: {
            directory: "./data/seeds"
        }
    },
    testing: {
        client: "pg",
        connection: {
            database: process.env.DB_NAME_TESTING,
            user:     process.env.DB_USER,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./data/migrations"
        },
        seeds: {
            directory: "./data/seeds"
        }
    },
    production: {
        client: 'pg',
        connection: {
            database: process.env.DB_NAME,
            user:     process.env.DB_USER,
            password: process.env.DB_PASSWORD
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./data/migrations"
        },
        seeds: {
            directory: "./data/seeds"
        }
    }

};
