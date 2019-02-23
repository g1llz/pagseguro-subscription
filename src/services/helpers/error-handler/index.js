const winston = require('winston');
const convert = require('xml-js');

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
        err = convert.xml2js(err.error, { compact: true, spaces: 4 });
        err = err.errors.error;
        err = err instanceof Array ? err[0] : err;

        process.env.USE_SLACK && slack.send({
            text: '*_(PagSeguro)_ ERROR*',
            attachments: [
                {
                    fields: [
                        { title: 'CODE', value: err.code._text, short: true },
                        { title: 'MESSAGE', value: err.message._text, short: true }
                    ]
                }
            ]
        });
        logger.log('error', { date: new Date().toISOString(), code: err.code._text, message: err.message._text });
        rejectFn({ error: err });
    } else {
        console.log('API')
        let codeRef = 'N/A'; let messageRef;
        if (err.code) codeRef = err.code;
        if (err.cause) codeRef = err.name;
        if (err.cause) messageRef = err.message;
        if (err.apiMessage) messageRef = err.apiMessage;
        if (err.sqlMessage) messageRef = err.sqlMessage;

        process.env.USE_SLACK && slack.send({
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
