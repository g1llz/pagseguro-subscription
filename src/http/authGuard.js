const jwt = require('jsonwebtoken');

const authGuard = (deps) => {
    return (req, res, next) => {
        if (!deps.exclusions.includes(req.href())) {
            const token = req.headers['x-access-token'];
            if (!token) {
                res.send(403, { error: { code: 1000, message: 'token not provided.' } });
                return false;
            }
            try {
                req.decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                res.send(403, { error: { code: 1001, message: 'invalid token.' } });
                return false;
            }
        }
        next();
    }
}

module.exports = authGuard;
