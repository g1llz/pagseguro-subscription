const mysql = require('mysql');
const connect = mysql.createConnection({
    host: process.env.MYSQL_host,
    user: process.env.MYSQL_user,
    password: process.env.MYSQL_password,
    database: process.env.MYSQL_database
});

const errorHandler = (error, msg, rejectFunction) => {
    console.log(error);
    rejectFunction({ error: msg });
}

const authModule = require('./auth')({ connect, errorHandler });
const usersModule = require('./users')({ connect, errorHandler });

module.exports = {
    auth: () => authModule,
    users: () => usersModule,
}
