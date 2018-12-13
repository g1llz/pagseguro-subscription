const request = require('request-promise');
const convert = require('xml-js');

const pgAPIURL = process.env.PAG_url;
const pgAccess = { email: process.env.PAG_email, token: process.env.PAG_token };
const pgHeader = {
    'Content-Type': 'application/json;charset=ISO-8859-1',
    'Accept': 'application/vnd.pagseguro.com.br.v3+json;charset=ISO-8859-1'
};

const subscription = deps => {
    const { errorHandler } = deps;
    return {
        new: (customer) => {
            const options = {
                headers: pgHeader,
                uri: `${pgAPIURL}/pre-approvals`,
                qs: pgAccess,
                body: customer,
                json: true,
                method: 'POST'
            }
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        if (res.code) {
                            resolve({ message: 'subscription done.', res })
                        }
                    })
                    .catch((error) => {
                        errorHandler(error, 'subscription failed.', reject);
                        return false;
                    });
            });
        },
        create: plan => {
            const options = {
                headers: pgHeader,
                uri: `${pgAPIURL}/pre-approvals/request`,
                qs: pgAccess,
                body: plan,
                json: true,
                method: 'POST'
            }
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        resolve(res);
                    })
                    .catch((error) => {
                        errorHandler(error, 'failed to create a plan.', reject);
                        return false;
                    });
            });
        },
        start: () => {
            const options = {
                // in this case header needs just content-type;
                headers: {
                    'Content-Type': 'application/json;charset=ISO-8859-1'
                },
                uri: `${pgAPIURL}/v2/sessions`,
                qs: pgAccess,
                method: 'POST'
            }
            return new Promise((resolve, reject) => {
                request(options).then((res) => {
                    let json = convert.xml2js(res, { compact: true, spaces: 4 })
                    resolve(json.session.id._text);
                }).catch((error) => {
                    errorHandler(error, 'could not start a session.', reject);
                    return false;
                });
            })
        }
    }
}

module.exports = subscription;
