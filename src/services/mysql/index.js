const errorHandler = require('../helpers/error-handler');
const mysql = require('mysql');
const connect = mysql.createConnection({
    host: process.env.MYSQL_host,
    user: process.env.MYSQL_user,
    password: process.env.MYSQL_password,
    database: process.env.MYSQL_database
});

const userModule = require('./users')({ connect, errorHandler });
const authModule = require('./auth')({ connect, errorHandler });

module.exports = {
    user: () => userModule,
    auth: () => authModule
};
