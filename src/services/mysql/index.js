const errorHandler = require('../helpers/error-handler');
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_host,
    user: process.env.MYSQL_user,
    password: process.env.MYSQL_password,
    database: process.env.MYSQL_database
});

const userModule = require('./users')({ pool, errorHandler });
const authModule = require('./auth')({ pool, errorHandler });

module.exports = {
    user: () => userModule,
    auth: () => authModule
};
