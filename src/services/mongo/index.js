const errorHandler = require('../helpers/error-handler');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true }).catch(err => console.log(err));

const usersModule = require('./users')({ errorHandler });

module.exports = {
    users: () => usersModule
};
