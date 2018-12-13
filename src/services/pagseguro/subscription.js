const request = require('request-promise');
const convert = require('xml-js');

const pgAPIURL = process.env.PAG_url;
const pgAccess = { email: process.env.PAG_email, token: process.env.PAG_token };
const pgHeader = {
    'Content-Type': 'application/json;charset=ISO-8859-1',
    'Accept': 'application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1'
};

const subscription = deps => {
    const { errorHandler } = deps;
    return {
        new: customer => {
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
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        if (res.directPreApproval) {
                            resolve({ message: 'subscription done.', code: res.directPreApproval.code })
                        }
                    })
                    .catch((err) => {
                        errorHandler(err, reject);
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
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        resolve(res);
                    })
                    .catch((err) => {
                        errorHandler(err, reject);
                        return false;
                    });
            });
        },
        ordersByApprovalCode: code => {
            const options = {
                headers: pgHeader,
                uri: `${pgAPIURL}/pre-approvals/${code}/payment-orders`,
                qs: pgAccess,
                method: 'GET'
            }
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        let json = convert.xml2js(res, { compact: true, spaces: 4 })
                        resolve(json);
                    })
                    .catch((err) => {
                        errorHandler(err, reject);
                        return false;
                    });
            });
        },
        signatureDetailByApprovalCode: code => {
            const options = {
                headers: pgHeader,
                uri: `${pgAPIURL}/pre-approvals/${code}`,
                qs: pgAccess,
                method: 'GET'
            }
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        let json = convert.xml2js(res, { compact: true, spaces: 4 })
                        resolve(json);
                    })
                    .catch((err) => {
                        errorHandler(err, reject);
                        return false;
                    });
            });
        }
    }
}

module.exports = subscription;
