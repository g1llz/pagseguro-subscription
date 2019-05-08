const db = require('../services/mysql');
const pg = require('../services/pagseguro');

const routes = (server) => {
    server.get(process.env.URI, (req, res, next) => {
        res.json({ text: 'silence is gold.' });
        next();
    });

    server.post(`${process.env.URI}/auth`, async (req, res, next) => {
        const { email, password } = req.body;
        try {
            res.json(await db.auth().authenticate(email, password));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.get(`${process.env.URI}/start-payment`, async (req, res, next) => {
        try {
            res.json(await pg.session().start());
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post(`${process.env.URI}/plan/create`, async (req, res, next) => {
        const { plan } = req.body;
        try {
            res.json(await pg.plan().create(plan));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post(`${process.env.URI}/subscription/new`, async (req, res, next) => {
        const { customer } = req.body;
        try {
            res.json(await pg.subscription().new(customer));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.get(`${process.env.URI}/subscription/:code/orders`, async (req, res, next) => {
        const { code } = req.params;
        try {
            res.json(await pg.subscription().ordersByApprovalCode(code));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.get(`${process.env.URI}/subscription/:code/detail`, async (req, res, next) => {
        const { code } = req.params;
        try {
            res.json(await pg.subscription().signatureDetailByApprovalCode(code));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post(`${process.env.URI}/subscription/order-discount`, async (req, res, next) => {
        const { code, discount } = req.body;
        try {
            res.json(await pg.subscription().discountInNextOrder(code, discount));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.put(`${process.env.URI}/subscription/:code/cancel`, async (req, res, next) => {
        const { code } = req.params;
        try {
            res.json(await pg.subscription().cancel(code));
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post(`${process.env.URI}/notifications`, async (req, res, next) => {
        const { notificationCode, notificationType } = req.body;
        try {
            res.json(await pg.notification().receive(notificationCode, notificationType))
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.get(`${process.env.URI}/users`, async (req, res, next) => {
        try {
            res.json(await db.user().all());
        } catch (error) {
            res.status(error.status);
            res.json(error);
        }
        next();
    });

    server.post(`${process.env.URI}/users`, async (req, res, next) => {
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
