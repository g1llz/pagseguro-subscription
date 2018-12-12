const sha1 = require('sha1');

const users = deps => {
    const { connect, errorHandler } = deps;
    return {
        all: () => {
            return new Promise((resolve, reject) => {
                connect.query('SELECT id, email FROM user', (error, results) => {
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
                connect.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, sha1(password)], (error, results) => {
                    if (error || !results.affectedRows) {
                        errorHandler(error, 'failed to save user.', reject);
                        return false;
                    };
                    resolve({ user: { email, id: results.insertId }, affectedRows: results.affectedRows });
                });
            })
        },
        update: (id, password) => {
            return new Promise((resolve, reject) => {
                connect.query('UPDATE user SET password = ? WHERE id = ?', [sha1(password), id], (error, results) => {
                    if (error || !results.affectedRows) {
                        errorHandler(error, `failed to update user. id: ${id}.`, reject);
                        return false;
                    };
                    resolve({ user: { id }, affectedRows: results.affectedRows });
                });
            })
        },
        del: (id) => {
            return new Promise((resolve, reject) => {
                connect.query('DELETE FROM user WHERE id = ?', [id], (error, results) => {
                    if (error || !results.affectedRows) {
                        errorHandler(error, `failed to remove user. id: ${id}.`, reject);
                        return false;
                    };
                    resolve({ message: 'user removed.', affectedRows: results.affectedRows });
                });
            })
        }
    }
}

module.exports = users;
