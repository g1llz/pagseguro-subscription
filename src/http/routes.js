const ac = require('../services/auth');
const db = require('../services/mongo');
const pg = require('../services/pagseguro');

const routes = (server) => {
    server.get('/api/v1', (req, res, next) => {
        res.send('silence is gold.');
        next();
    });

    server.post('/api/v1/auth', async (req, res, next) => {
        const { email, password } = req.body;
        try {
            res.send(await ac.auth().authenticate(email, password));
        } catch (error) {
            res.send(error);
        }
        next();
    });

    server.post('/api/v1/start-payment', async (req, res, next) => {
        try {
            res.send(await pg.start);
        } catch (error) {
            res.send(error);
        }
        next();
    });

    server.post('/api/v1/subscription/create', async (req, res, next) => {
        const { plan } = req.body;
        try {
            res.send(await pg.subscription().create(plan));
        } catch (error) {
            res.send(error);
        }
        next();
    });

    server.post('/api/v1/subscription/new', async (req, res, next) => {
        const { customer } = req.body;
        try {
            res.send(await pg.subscription().new(customer));
        } catch (error) {
            res.send(error);
        }
        next();
    });

    server.post('/api/v1/subscription/orders', async (req, res, next) => {
        const { code } = req.body;
        try {
            res.send(await pg.subscription().ordersByApprovalCode(code));
        } catch (error) {
            res.send(error);
        }
        next();
    });

    server.post('/api/v1/subscription/detail', async (req, res, next) => {
        const { code } = req.body;
        try {
            res.send(await pg.subscription().signatureDetailByApprovalCode(code));
        } catch (error) {
            res.send(error);
        }
        next();
    });

    server.post('/api/v1/notifications', async (req, res, next) => {
        const { notificationCode } = req.body;
        try {
            res.send(await pg.notification().receive(notificationCode))
        } catch (error) {
            res.send(error);
        }
        next();
    });

    server.get('/api/v1/users', async (req, res, next) => {
        try {
            res.send(await db.users().all());
        } catch (error) {
            res.send(error);
        }
        next();
    });

    server.post('/api/v1/users', async (req, res, next) => {
        const { email, password } = req.body;
        try {
            res.send(await db.users().save(email, password));
        } catch (error) {
            res.send(error);
        }
        next();
    });
};

module.exports = routes;
