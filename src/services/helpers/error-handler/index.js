const convert = require('xml-js');

const errorHandler = (err, rejectFunction, msg = '') => {
    console.log(err || err.erros);
    if (!msg) {
        err = convert.xml2js(err.error, { compact: true, spaces: 4 })
    }
    rejectFunction({ error: err.errors || msg });
}

module.exports = errorHandler;
