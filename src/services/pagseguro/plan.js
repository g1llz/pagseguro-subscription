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
    const { errorHandler } = deps;
    return {
        create: (plan) => {
            options.uri = `${APIURL}/pre-approvals/request`;
            options.body = plan;
            options.method = 'POST';
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, xml2Opt)
                        resolve({ message: 'subscription plan created', plan: res.preApprovalRequest });
                    })
                    .catch((err) => {
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        }
    }
}

module.exports = plan;
