const sha1 = require('sha1');
const jwt = require('jsonwebtoken');

const auth = deps => {
    const { connect, errorHandler } = deps;
    return {
        authenticate: (email, password) => {
            return new Promise((resolve, reject) => {
                connect.query('SELECT id, email FROM user WHERE email = ? AND password = ?', [email, sha1(password)], (error, results) => {
                    if (error || !results.length) {
                        errorHandler(error, 'Falha ao localizar o usuários.', reject);
                        return false;
                    };
                    const { email, id } = results[0];
                    const token = jwt.sign({ email, id }, process.env.JWT_secret, { expiresIn: 60 * 60 * 24 });
                    resolve({ token });
                });
            })
        }
    }
}

module.exports = auth;
