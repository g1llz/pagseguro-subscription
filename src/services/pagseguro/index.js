const errorHandler = require('../helpers/error-handler');

const optionsModule = require('./options')({ errorHandler });

module.exports = {
    options: () => optionsModule
}
