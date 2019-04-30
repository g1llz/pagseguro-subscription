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
    let status;
    if ((err.error) && !err.cause) {
        status = err.response.statusCode;
        console.log('PAG');
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
        logger.log('error', { date: new Date().toISOString(), status: status, code: err.code, message: err.message });
        rejectFn({ status: status, error: err });
    } else {
        status = err.status;
        console.log('API');
        process.env.USE_SLACK === 'true' && slack.send({
            text: '*_(API)_ ERROR*',
            attachments: [
                {
                    fields: [
                        { title: 'STATUS', value: status, short: false },
                        { title: 'MESSAGE', value: err.message, short: false },
                        { title: 'STACKTRACE', value: err.stacktrace, short: false }
                    ]
                }
            ]
        });
        logger.log('error', { date: new Date().toISOString(), status: status, message: err.message, stacktrace: err.stacktrace });
        rejectFn({ status: status, error: err.message });
    }
}

module.exports = errorHandler;
