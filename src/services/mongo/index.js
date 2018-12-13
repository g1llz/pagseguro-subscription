const errorHandler = require('../helpers/error-handler');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

const usersModule = require('./users')({ errorHandler });

module.exports = {
    users: () => usersModule
};
