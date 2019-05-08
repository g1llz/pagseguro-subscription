const errorHandler = require('../helpers/error-handler');
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const userModule = require('./users')({ pool, errorHandler });
const authModule = require('./auth')({ pool, errorHandler });

module.exports = {
    user: () => userModule,
    auth: () => authModule
};
