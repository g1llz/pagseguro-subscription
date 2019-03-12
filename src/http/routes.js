const db = require('../services/mysql');
const pg = require('../services/pagseguro');

const routes = (server) => {
    server.get('/api/v1', (req, res, next) => {
        res.send('silence is gold.');
        next();
    });

    server.post('/api/v1/auth', async (req, res, next) => {
        const { email, password } = req.body;
        try {
            res.send(await db.auth().authenticate(email, password));
        } catch (error) {
            res.send(401, error);
        }
        next();
    });

    server.post('/api/v1/start-payment', async (req, res, next) => {
        try {
            res.send(await pg.session().start());
        } catch (error) {
            res.send(401, error);
        }
        next();
    });

    server.post('/api/v1/plan/create', async (req, res, next) => {
        const { plan } = req.body;
        try {
            res.send(await pg.plan().create(plan));
        } catch (error) {
            res.send(400, error);
        }
        next();
    });

    server.post('/api/v1/subscription/new', async (req, res, next) => {
        const { customer } = req.body;
        try {
            res.send(await pg.subscription().new(customer));
        } catch (error) {
            res.send(400, error);
        }
        next();
    });

    server.post('/api/v1/subscription/orders', async (req, res, next) => {
        const { code } = req.body;
        try {
            res.send(await pg.subscription().ordersByApprovalCode(code));
        } catch (error) {
            res.send(400, error);
        }
        next();
    });

    server.post('/api/v1/subscription/detail', async (req, res, next) => {
        const { code } = req.body;
        try {
            res.send(await pg.subscription().signatureDetailByApprovalCode(code));
        } catch (error) {
            res.send(400, error);
        }
        next();
    });

    server.post('/api/v1/subscription/order-discount', async (req, res, next) => {
        const { code, discount } = req.body;
        try {
            res.send(await pg.subscription().discountInNextOrder(code, discount));
        } catch (error) {
            res.send(400, error);
        }
        next();
    });

    server.post('/api/v1/subscription/cancel', async (req, res, next) => {
        const { code } = req.body;
        try {
            res.send(await pg.subscription().cancel(code));
        } catch (error) {
            res.send(400, error);
        }
        next();
    });

    server.post('/api/v1/notifications', async (req, res, next) => {
        const { notificationCode, notificationType } = req.body;
        try {
            res.send(await pg.notification().receive(notificationCode, notificationType))
        } catch (error) {
            res.send(400, error);
        }
        next();
    });

    server.get('/api/v1/users', async (req, res, next) => {
        try {
            res.send(await db.user().all());
        } catch (error) {
            res.send(404, error);
        }
        next();
    });

    server.post('/api/v1/users', async (req, res, next) => {
        const { email, password } = req.body;
        console.log(email, password)
        try {
            res.send(await db.user().save(email, password));
        } catch (error) {
            res.send(400, error);
        }
        next();
    });
};

module.exports = routes;
