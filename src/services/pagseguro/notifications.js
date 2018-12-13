const request = require('request-promise');
const convert = require('xml-js');

const pgAPIURL = process.env.PAG_url;
const pgAccess = { email: process.env.PAG_email, token: process.env.PAG_token };
const pgHeader = {
    'Content-Type': 'application/json;charset=ISO-8859-1',
    'Accept': 'application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1'
};

const notification = deps => {
    const { errorHandler } = deps;
    return {
        receive: code => {
            const options = {
                headers: pgHeader,
                uri: `${pgAPIURL}/pre-approvals/notifications/${code}`,
                qs: pgAccess,
                method: 'GET'
            }
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        resolve({ res })
                    })
                    .catch((err) => {
                        errorHandler(err, reject);
                        return false;
                    });
            });
        }
    }
}

module.exports = notification;
