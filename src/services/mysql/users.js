const sha1 = require('sha1');

const users = deps => {
    const { pool, errorHandler } = deps;
    return {
        all: () => {
            return new Promise((resolve, reject) => {
                pool.getConnection((error, connection) => {
                    if (error) {
                        errorHandler(error, 'MySQL Error.', reject);
                        return false;
                    };
                    connection.query('SELECT id, email FROM users', (error, results) => {
                        if (error) {
                            errorHandler(error, 'failed to list users.', reject);
                            return false;
                        };
                        resolve({ users: results });
                    });
                    connection.end();
                });
            })
        },
        save: (email, password) => {
            return new Promise((resolve, reject) => {
                if (email && password) {
                    pool.getConnection((error, connection) => {
                        if (error) {
                            errorHandler(error, 'MySQL Error.', reject);
                            return false;
                        };
                        connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, sha1(password)], (error, results) => {
                            if (error || !results.affectedRows) {
                                errorHandler(error, 'failed to save user.', reject);
                                return false;
                            };
                            resolve({ user: { email, id: results.insertId }, affectedRows: results.affectedRows });
                        });
                        connection.end();
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
