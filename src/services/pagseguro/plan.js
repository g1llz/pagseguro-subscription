const request = require('request-promise');
const convert = require('xml-js');
const xml2Opt = require('../helpers/remove-text-attribute');

const APIURL = process.env.PAG_URL;

const options = {
    headers: { 'Content-Type': 'application/json;charset=ISO-8859-1', 'Accept': 'application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1' },
    qs: { email: process.env.PAG_EMAIL, token: process.env.PAG_TOKEN },
    json: true
}

const plan = deps => {
    const { errorHandler, notFoundOrUnauthorized } = deps;
    return {
        /*   @params
         *   plan: an object that contains all the required information to create a new plan;
         *   ** read more in documentation;
         */
        create: (plan) => {
            options.uri = `${APIURL}/pre-approvals/request`;
            options.body = {
                /*  mount the object that will be sent to the PAGSEGURO */
                reference: plan.reference,
                preApproval: {
                    name: plan.planName,
                    charge: 'AUTO',
                    period: 'MONTHLY',
                    amountPerPayment: plan.amountPerPayment.toFixed(2),
                    trialPeriodDuration: plan.trialPeriodDuration,
                    expiration: {
                        value: plan.expirationMonths,
                        unit: 'MONTHS'
                    },
                    details: plan.planDetails
                }
            };
            options.method = 'POST';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, xml2Opt)
                        resolve({ message: 'subscription plan created', plan: res.preApprovalRequest });
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

module.exports = plan;
