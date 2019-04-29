const request = require('request-promise');
const convert = require('xml-js');
const xml2Opt = require('../helpers/remove-text-attribute');

const session = deps => {
    const { errorHandler, notFoundOrUnauthorized } = deps;
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
                    res = convert.xml2js(res, xml2Opt)
                    resolve(res.session.id);
                }).catch((err) => {
                    errorHandler(notFoundOrUnauthorized(err.response.statusCode), '', reject);
                    return false;
                });
            })
        }
    }
}

module.exports = session;
