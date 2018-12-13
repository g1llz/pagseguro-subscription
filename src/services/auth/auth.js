const User = require('../mongo/user.model');
const sha1 = require('sha1');
const jwt = require('jsonwebtoken');

const auth = deps => {
    const { errorHandler } = deps;
    return {
        authenticate: (email, password) => {
            return new Promise((resolve, reject) => {
                User.find({ email: email, password: sha1(password) }).then((response) => {
                    if (response.length) {
                        const { email, id } = response[0];
                        const token = jwt.sign({ email, id }, process.env.JWT_secret, { expiresIn: 60 * 60 * 24 });
                        resolve({ token });
                    } else {
                        errorHandler(new Error('user not found or invalid password'), 'user not found.', reject);
                        return false;
                    }
                }).catch((error) => {
                    errorHandler(error, 'failed unexpected try again later.', reject);
                    return false;
                })
            })
        }
    }
}

module.exports = auth;
