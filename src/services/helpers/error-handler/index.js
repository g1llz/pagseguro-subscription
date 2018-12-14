const convert = require('xml-js');
const slack = require('slack-notify')(process.env.MY_SLACK_WEBHOOK_URL);

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
    } else {
        slack.send({
            text: '*_(API)_ ERROR*',
            attachments: [
                {
                    fields: [
                        { title: 'MESSAGE', value: msg, short: false },
                        { title: 'STACKTRACE', value: err.toString(), short: false }
                    ]
                }
            ]
        });
    }
    rejectFunction({ error: err.error || msg });
    console.log(err.error || err);
}

module.exports = errorHandler;
