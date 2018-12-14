const sha1 = require('sha1');
const User = require('./user.model');

const users = deps => {
    const { errorHandler } = deps;
    return {
        all: () => {
            return new Promise((resolve, reject) => {
                User.find().then((response) => {
                    resolve({ users: response });
                }).catch((error) => {
                    errorHandler(error, reject, 'failed to list users.');
                    return false;
                });
            })
        },
        save: (email, password) => {
            return new Promise((resolve, reject) => {
                if (email && password) {
                    let user = new User({ email: email, password: sha1(password) });
                    user.save().then((response) => {
                        response.password = undefined;
                        resolve({ response });
                    }).catch((error) => {
                        errorHandler(error, reject, 'failed to save user.');
                        return false;
                    });
                } else {
                    errorHandler(new Error('email or password not informed'), reject, 'inform an email and password.');
                    return false;
                }
            })
        },
        update: (id, password) => {
            return new Promise((resolve, reject) => {
                // needs to be implemented;
            })
        },
        del: (id) => {
            return new Promise((resolve, reject) => {
                // needs to be implemented;
            })
        }
    }
}

module.exports = users;
