const request = require('request-promise');
const convert = require('xml-js');
const xml2Opt = require('../helpers/remove-text-attribute');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'notification.log', level: 'info' })
    ]
});

const headerTransaction = { 'Content-Type': 'application/json;charset=ISO-8859-1' }
const headerPreApproval = { 'Content-Type': 'application/json;charset=ISO-8859-1', 'Accept': 'application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1' }

const notification = deps => {
    const { errorHandler } = deps;
    return {
        /*   @params
         *   code: e.g. pre-approval: FDE3F3-08B7ADB7AD97-6DD4347F9B09-28AEE4
         *         e.g. transaction : AE419B-B2E08041EFAF-29BDD98974766A
         *   type: preApproval or transaction
         */
        receive: (code, type) => {
            console.log('-- GET notification')
            console.log('-- CODE: ', code);
            console.log('-- TYPE: ', type);
            const path = type === 'preApproval' ? 'pre-approvals' : 'v3/transactions';
            const options = {
                headers: type === 'transaction' ? headerTransaction : headerPreApproval,
                uri: `${process.env.PAG_URL}/${path}/notifications/${code}`,
                qs: { email: process.env.PAG_EMAIL, token: process.env.PAG_TOKEN },
                method: 'GET'
            }
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, xml2Opt)
                        const respRef = type === 'transaction' ? res.transaction : res.preApproval;
                        request({
                            uri: process.env.URL_NOTIFICATION,
                            headers: { 'Content-Type': 'application/json;charset=ISO-8859-1' },
                            method: 'POST',
                            body: {
                                response: {
                                    type: type,
                                    date: respRef.date,
                                    code: respRef.code,
                                    reference: respRef.reference,
                                    status: respRef.status,
                                    lastEventDate: respRef.lastEventDate,
                                    grossAmount: type === 'transaction' ? respRef.grossAmount : '0.00'
                                }
                            },
                            json: true
                        }).then((res) => {
                            logger.log('info', { date: new Date().toISOString(), message: `notification send to ${process.env.URL_NOTIFICATION}` });
                            resolve({ message: 'notification send.', date: new Date().toISOString() })
                        }).catch((err) => {
                            errorHandler(err, '', reject);
                            return false;
                        });
                    })
                    .catch((err) => {
                        errorHandler(err, '', reject);
                        return false;
                    });
            });
        }
    }
}

module.exports = notification;
