const errorHandler = (error, msg, rejectFunction) => {
    console.log(error);
    rejectFunction({ error: msg });
}

const optionsModule = require('./options')({ errorHandler });

module.exports = {
    options: () => optionsModule
}
