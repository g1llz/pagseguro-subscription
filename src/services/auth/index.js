const errorHandler = require('../helpers/error-handler');

const authModule = require('./auth')({ errorHandler });

module.exports = {
    auth: () => authModule
};
