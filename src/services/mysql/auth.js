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
                            errorHandler(error, 'MySQL Error.', reject);
                            return false;
                        };
                        connection.query('SELECT id, email FROM users WHERE email = ? AND password = ?', [email, sha1(password)], (error, results) => {
                            if (error || !results.length) {
                                errorHandler(error || { apiMessage: 'user not found' }, 'user not found', reject);
                                return false;
                            };
                            const { email, id } = results[0];
                            const token = jwt.sign({ email, id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                            resolve({ token });
                        });
                    });
                } else {
                    errorHandler({ apiMessage: 'email and password are required' }, 'email and password are required', reject);
                    return false;
                }
            })
        }
    }
}

module.exports = auth;
