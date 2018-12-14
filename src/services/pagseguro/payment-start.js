const request = require('request-promise');
const convert = require('xml-js');

const start = deps => {
    const { errorHandler } = deps;
    const options = {
        // in this case header needs just content-type;
        headers: { 'Content-Type': 'application/json;charset=ISO-8859-1' },
        uri: `${process.env.PAG_url}/v2/sessions`,
        qs: { email: process.env.PAG_email, token: process.env.PAG_token },
        method: 'POST'
    }
    return new Promise((resolve, reject) => {
        request(options).then((res) => {
            let json = convert.xml2js(res, { compact: true, spaces: 4 })
            resolve(json.session.id._text);
        }).catch((err) => {
            errorHandler(err, reject);
            return false;
        });
    })
}

module.exports = start;