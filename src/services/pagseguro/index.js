const errorHandler = require('../helpers/error-handler');

const planModule = require('./plan')({ errorHandler });
const sessionModule = require('./payment-start')({ errorHandler });
const subscriptionModule = require('./subscription')({ errorHandler });
const notificationModule = require('./notifications')({ errorHandler });

module.exports = {
    plan: () => planModule,
    session: () => sessionModule,
    subscription: () => subscriptionModule,
    notification: () => notificationModule
}
