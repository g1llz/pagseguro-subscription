const request = require('request-promise');
const convert = require('xml-js');

const session = deps => {
    const { errorHandler } = deps;
    return {
        start: () => {
            const options = {
                headers: { 'Content-Type': 'application/json;charset=ISO-8859-1' },
                uri: `${process.env.PAG_URL}/v2/sessions`,
                qs: { email: process.env.PAG_EMAIL, token: process.env.PAG_TOKEN },
                method: 'POST'
            }
            return new Promise((resolve, reject) => {
                request(options).then((res) => {
                    let json = convert.xml2js(res, { compact: true, spaces: 4 })
                    resolve(json.session.id._text);
                }).catch((err) => {
                    errorHandler(err, '', reject);
                    return false;
                });
            })
        }
    }
}

module.exports = session;
