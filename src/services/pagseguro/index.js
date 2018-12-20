const errorHandler = require('../helpers/error-handler');

const sessionModule = require('./payment-start')({ errorHandler });
const subscriptionModule = require('./subscription')({ errorHandler });
const notificationModule = require('./notifications')({ errorHandler });

module.exports = {
    session: () => sessionModule,
    subscription: () => subscriptionModule,
    notification: () => notificationModule
}
