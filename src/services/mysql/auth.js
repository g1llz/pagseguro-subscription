const sha1 = require('sha1');
const jwt = require('jsonwebtoken');

const auth = deps => {
    const { pool, errorHandler } = deps;
    return {
        authenticate: (email, password) => {
            return new Promise((resolve, reject) => {
                if (email && password) {
                    pool.getConnection((error, connection) => {
                        if (error) {
                            errorHandler({
                                stacktrace: error.toString(),
                                status: 500,
                                message: 'MySQL Error'
                            }, 'MySQL Error.', reject);
                            return false;
                        };
                        connection.query('SELECT id, email FROM users WHERE email = ? AND password = ?', [email, sha1(password)], (error, results) => {
                            if (error || !results.length) {
                                errorHandler({
                                    stacktrace: error ? error.toString() : '',
                                    status: 401,
                                    message: 'email or password is incorrect'
                                }, 'email or password is incorrect', reject);
                                return false;
                            };
                            const { email, id } = results[0];
                            const token = jwt.sign({ email, id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                            resolve({ token });
                        });
                        connection.end();
                    });
                } else {
                    errorHandler({
                        stacktrace: '',
                        status: 400,
                        message: 'email and password is required'
                    }, 'email and password is required', reject);
                    return false;
                }
            })
        }
    }
}

module.exports = auth;
