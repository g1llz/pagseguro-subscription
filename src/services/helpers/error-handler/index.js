const winston = require('winston');
const convert = require('xml-js');
const xml2Opt = require('../remove-text-attribute');

const slack = require('slack-notify')(process.env.MY_SLACK_WEBHOOK_URL);

const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});

const errorHandler = (err, msg, rejectFn) => {
    if (err.error && !err.cause) {
        console.log('PAG')
        err = convert.xml2js(err.error, xml2Opt);
        err = err.errors.error;
        err = err instanceof Array ? err[0] : err;

        process.env.USE_SLACK === 'true' && slack.send({
            text: '*_(PagSeguro)_ ERROR*',
            attachments: [
                {
                    fields: [
                        { title: 'CODE', value: err.code, short: true },
                        { title: 'MESSAGE', value: err.message, short: true }
                    ]
                }
            ]
        });
        logger.log('error', { date: new Date().toISOString(), code: err.code, message: err.message });
        rejectFn({ error: err });
    } else {
        console.log('API')
        let codeRef = 'N/A'; let messageRef;
        if (err.code) codeRef = err.code;
        if (err.cause) codeRef = err.name;
        if (err.cause) messageRef = err.message;
        if (err.apiMessage) messageRef = err.apiMessage;
        if (err.sqlMessage) messageRef = err.sqlMessage;

        process.env.USE_SLACK === 'true' && slack.send({
            text: '*_(API)_ ERROR*',
            attachments: [
                {
                    fields: [
                        { title: 'CODE', value: codeRef, short: false },
                        { title: 'MESSAGE', value: messageRef, short: false }
                    ]
                }
            ]
        });
        logger.log('error', { date: new Date().toISOString(), message: messageRef, code: codeRef });
        rejectFn({ error: msg });
    }
}

module.exports = errorHandler;
