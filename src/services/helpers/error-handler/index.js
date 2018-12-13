const convert = require('xml-js');

const errorHandler = (err, rejectFunction) => {
    let e = convert.xml2js(err.error, { compact: true, spaces: 4 })
    console.log(e.errors);
    rejectFunction({ error: e.errors });
}

module.exports = errorHandler;
