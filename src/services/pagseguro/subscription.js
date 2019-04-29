const request = require('request-promise');
const convert = require('xml-js');
const xml2Opt = require('../helpers/remove-text-attribute');

const APIURL = process.env.PAG_URL;

const options = {
    headers: { 'Content-Type': 'application/json;charset=ISO-8859-1', 'Accept': 'application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1' },
    qs: { email: process.env.PAG_EMAIL, token: process.env.PAG_TOKEN },
    json: true
}

const subscription = deps => {
    const { errorHandler, notFoundOrUnauthorized } = deps;
    return {
        /*   @params
         *   access documentation --'
         */
        new: (customer) => {
            options.uri = `${APIURL}/pre-xapprovals`;
            options.body = customer;
            options.method = 'POST';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, xml2Opt)
                        if (res.directPreApproval) {
                            resolve({ message: 'subscription done.', code: res.directPreApproval.code })
                        }
                    })
                    .catch((err) => {
                        if (err.response.statusCode === 404 || err.response.statusCode === 401) {
                            errorHandler(notFoundOrUnauthorized(err.response.statusCode), '', reject);
                            return false;
                        }
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        },
        /*   @params
         *   code: 22D09B366D6D5B955461BF9BF6C77F31
         *   discount: { type: DISCOUNT_PERCENT, value: 10.33 }
         */
        discountInNextOrder: (code, discount) => {
            options.uri = `${APIURL}/pre-approvals/${code}/discount`;
            options.body = discount;
            options.method = 'PUT';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        // if OK, 'res' return nothing;
                        resolve({ message: 'request for discount in next order.' })
                    })
                    .catch((err) => {
                        if (err.response.statusCode === 404 || err.response.statusCode === 401) {
                            errorHandler(notFoundOrUnauthorized(err.response.statusCode), '', reject);
                            return false;
                        }
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        },
        /*   @params
         *   code: 22D09B366D6D5B955461BF9BF6C77F31
         */
        ordersByApprovalCode: (code) => {
            options.uri = `${APIURL}/pre-approvals/${code}/payment-orders`;
            options.method = 'GET';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, xml2Opt)
                        resolve(res);
                    })
                    .catch((err) => {
                        if (err.response.statusCode === 404 || err.response.statusCode === 401) {
                            errorHandler(notFoundOrUnauthorized(err.response.statusCode), '', reject);
                            return false;
                        }
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        },
        /*   @params
         *   code: 22D09B366D6D5B955461BF9BF6C77F31
         */
        signatureDetailByApprovalCode: (code) => {
            options.uri = `${APIURL}/pre-approvals/${code}`;
            options.method = 'GET';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, xml2Opt)
                        resolve(res);
                    })
                    .catch((err) => {
                        if (err.response.statusCode === 404 || err.response.statusCode === 401) {
                            errorHandler(notFoundOrUnauthorized(err.response.statusCode), '', reject);
                            return false;
                        }
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        },
        /*   @params
         *   code: 22D09B366D6D5B955461BF9BF6C77F31
         */
        cancel: (code) => {
            options.uri = `${APIURL}/pre-approvals/${code}/cancel`;
            options.method = 'PUT';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        // if OK, 'res' return nothing;
                        resolve({ message: 'request for cancellation sent.' })
                    })
                    .catch((err) => {
                        if (err.response.statusCode === 404 || err.response.statusCode === 401) {
                            errorHandler(notFoundOrUnauthorized(err.response.statusCode), '', reject);
                            return false;
                        }
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        }
    }
}

module.exports = subscription;
