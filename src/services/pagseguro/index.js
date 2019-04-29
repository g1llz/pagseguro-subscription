const errorHandler = require('../helpers/error-handler');

const notFoundOrUnauthorized = (statusCode) => ({
    status: statusCode,
    message: {
        name: statusCode === 404 ? 'not found' : 'unauthorized ',
        text: statusCode === 404 ? 'resource not found' : 'resource unauthorized'
    },
    stacktrace: ''
});

const planModule = require('./plan')({ errorHandler, notFoundOrUnauthorized });
const sessionModule = require('./payment-start')({ errorHandler, notFoundOrUnauthorized });
const subscriptionModule = require('./subscription')({ errorHandler, notFoundOrUnauthorized });
const notificationModule = require('./notifications')({ errorHandler, notFoundOrUnauthorized });

module.exports = {
    plan: () => planModule,
    session: () => sessionModule,
    subscription: () => subscriptionModule,
    notification: () => notificationModule
}
