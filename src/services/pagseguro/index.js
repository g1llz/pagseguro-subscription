const errorHandler = require('../helpers/error-handler');

const start = require('./payment-start')({ errorHandler });
const subscriptionModule = require('./subscription')({ errorHandler });
const notificationModule = require('./notifications')({ errorHandler });

module.exports = {
    subscription: () => subscriptionModule,
    notification: () => notificationModule,
    start
}
