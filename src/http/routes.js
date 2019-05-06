const db = require('../services/mysql');
const pg = require('../services/pagseguro');
const checkData = require('../services/helpers/check-data');

const routes = (server) => {
    server.get('/api/v1', (req, res, next) => {
        res.json({ text: 'silence is gold.' });
        next();
    });

    server.post('/api/v1/auth', async (req, res, next) => {
        const { email, password } = req.body;
        try {
            res.json(await db.auth().authenticate(email, password));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.get('/api/v1/start-payment', async (req, res, next) => {
        try {
            res.json(await pg.session().start());
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post('/api/v1/plan/create', async (req, res, next) => {
        const { plan } = req.body;
        if (checkData('planSchema', plan)) {
            try {
                res.json(await pg.plan().create(plan));
            } catch (error) {
                res.status(error.status);
                res.json(error);
            }
        } else {
           res.status(400);
           res.json({ error: 'Please check the data sent.'}); 
        }
        next();
    });

    server.post('/api/v1/subscription/new', async (req, res, next) => {
        const { customer } = req.body;
        try {
            res.json(await pg.subscription().new(customer));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.get('/api/v1/subscription/:code/orders', async (req, res, next) => {
        const { code } = req.params;
        try {
            res.json(await pg.subscription().ordersByApprovalCode(code));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.get('/api/v1/subscription/:code/detail', async (req, res, next) => {
        const { code } = req.params;
        try {
            res.json(await pg.subscription().signatureDetailByApprovalCode(code));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post('/api/v1/subscription/order-discount', async (req, res, next) => {
        const { code, discount } = req.body;
        try {
            res.json(await pg.subscription().discountInNextOrder(code, discount));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.put('/api/v1/subscription/:code/cancel', async (req, res, next) => {
        const { code } = req.params;
        try {
            res.json(await pg.subscription().cancel(code));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post('/api/v1/notifications', async (req, res, next) => {
        const { notificationCode, notificationType } = req.body;
        try {
            res.json(await pg.notification().receive(notificationCode, notificationType))
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.get('/api/v1/users', async (req, res, next) => {
        try {
            res.json(await db.user().all());
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post('/api/v1/users', async (req, res, next) => {
        const { email, password } = req.body;
        try {
            res.json(await db.user().save(email, password));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });
};

module.exports = routes;
