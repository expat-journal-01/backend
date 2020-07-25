// Update with your config settings.

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
    staging: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user:         'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    production: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user:         'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};
