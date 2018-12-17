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

const errorHandler = (err, rejectFunction, msg = '') => {
    if (!msg) {
        err = convert.xml2js(err.error, { compact: true, spaces: 4 });
        err = err.errors;
        slack.send({
            text: '*_(PagSeguro)_ ERROR*',
            attachments: [
                {
                    fields: [
                        { title: 'CODE', value: err.error.code._text, short: true },
                        { title: 'MESSAGE', value: err.error.message._text, short: true }
                    ]
                }
            ]
        });
        logger.log('error', { date: new Date().toISOString(), code: err.error.code._text, message: err.error.message._text });
    } else {
        slack.send({
            text: '*_(API)_ ERROR*',
            attachments: [
                {
                    fields: [
                        { title: 'MESSAGE', value: msg, short: false },
                        { title: 'STACKTRACE', value: err.stack, short: false }
                    ]
                }
            ]
        });
        logger.log('error', { date: new Date().toISOString(), message: err.stack });
    }
    rejectFunction({ error: err.error || msg });
}

module.exports = errorHandler;
