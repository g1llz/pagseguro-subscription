const request = require('request-promise');
const convert = require('xml-js');
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
        receive: (code, type) => {
            const path = type === 'preApproval' ? 'pre-approvals' : 'v3/transactions';
            const options = {
                headers: type === 'transaction' ? headerTransaction : headerPreApproval,
                uri: `${process.env.PAG_url}/${path}/notifications/${type === 'transaction' ? formatCode(code) : code}`,
                qs: { email: process.env.PAG_email, token: process.env.PAG_token },
                method: 'GET'
            }
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        const respRef = type === 'transaction' ? res.transaction : res.preApproval;
                        request({
                            uri: process.env.URL_notification,
                            headers: { 'Content-Type': 'application/json;charset=ISO-8859-1' },
                            method: 'POST',
                            body: {
                                response: {
                                    date: respRef.date,
                                    code: respRef.code,
                                    reference: respRef.reference,
                                    status: respRef.status,
                                    lastEventDate: respRef.lastEventDate
                                }
                            },
                            json: true
                        }).then((res) => {
                            logger.log('info', { date: new Date().toISOString(), message: `notification send to ${process.env.URL_notification}` });
                            resolve({ message: 'notification send.', date: new Date().toISOString() })
                        }).catch((err) => {
                            errorHandler(err, reject);
                            return false;
                        });
                    })
                    .catch((err) => {
                        errorHandler(err, reject);
                        return false;
                    });
            });
        }
    }
}

const formatCode = (code) => {
    return [code.substring(0, 6), '-', code.substring(6, 18), '-', code.substring(18, 30), '-', code.substring(30, 36)].join('')
}

module.exports = notification;
