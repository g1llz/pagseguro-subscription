const sha1 = require('sha1');

const users = deps => {
    const { connect, errorHandler } = deps;
    return {
        all: () => {
            return new Promise((resolve, reject) => {
                connect.query('SELECT id, email FROM users', (error, results) => {
                    if (error) {
                        errorHandler(error, 'failed to list users.', reject);
                        return false;
                    };
                    resolve({ users: results });
                });
            })
        },
        save: (email, password) => {
            return new Promise((resolve, reject) => {
                if (email && password) {
                    connect.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, sha1(password)], (error, results) => {
                        if (error || !results.affectedRows) {
                            errorHandler(error, 'failed to save user.', reject);
                            return false;
                        };
                        resolve({ user: { email, id: results.insertId }, affectedRows: results.affectedRows });
                    });
                } else {
                    errorHandler({ apiMessage: 'email and password are required' }, 'email and password are required', reject);
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
