const convert = require('xml-js');

const errorHandler = (err, rejectFunction, msg = '') => {
    if (!msg) {
        err = convert.xml2js(err.error, { compact: true, spaces: 4 });
        err = err.errors;
    }
    rejectFunction({ error: err.error || msg });
    console.log(err.error || err);
}

module.exports = errorHandler;
