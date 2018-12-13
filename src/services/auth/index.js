const errorHandler = (error, msg, rejectFunction) => {
    console.log(error);
    rejectFunction({ error: msg });
}

const authModule = require('./auth')({ errorHandler });

module.exports = {
    auth: () => authModule
};
