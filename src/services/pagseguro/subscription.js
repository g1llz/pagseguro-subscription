const request = require('request-promise');
const convert = require('xml-js');

const APIURL = process.env.PAG_URL;

const options = {
    headers: { 'Content-Type': 'application/json;charset=ISO-8859-1', 'Accept': 'application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1' },
    qs: { email: process.env.PAG_EMAIL, token: process.env.PAG_TOKEN },
    json: true
}

const subscription = deps => {
    const { errorHandler } = deps;
    return {
        new: (customer) => {
            options.uri = `${APIURL}/pre-approvals`;
            options.body = customer;
            options.method = 'POST';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        if (res.directPreApproval) {
                            resolve({ message: 'subscription done.', code: res.directPreApproval.code })
                        }
                    })
                    .catch((err) => {
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        },
        create: (plan) => {
            options.uri = `${APIURL}/pre-approvals/request`;
            options.body = plan;
            options.method = 'POST';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        resolve({ message: 'subscription plan created', plan: res.preApprovalRequest });
                    })
                    .catch((err) => {
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        },
        ordersByApprovalCode: (code) => {
            options.uri = `${APIURL}/pre-approvals/${code}/payment-orders`;
            options.json = false;
            options.method = 'GET';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        resolve(res);
                    })
                    .catch((err) => {
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        },
        signatureDetailByApprovalCode: (code) => {
            options.uri = `${APIURL}/pre-approvals/${code}`;
            options.json = false;
            options.method = 'GET';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        resolve(res);
                    })
                    .catch((err) => {
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        }
    }
}

module.exports = subscription;
