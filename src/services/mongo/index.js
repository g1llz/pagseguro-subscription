const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true });

const errorHandler = (error, msg, rejectFunction) => {
    console.log(error);
    rejectFunction({ error: msg });
}

const usersModule = require('./users')({ errorHandler });

module.exports = {
    users: () => usersModule
};
