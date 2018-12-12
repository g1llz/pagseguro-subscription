const sha1 = require('sha1');

const users = deps => {
    const { connect, errorHandler } = deps;
    return {
        all: () => {
            return new Promise((resolve, reject) => {
                connect.query('SELECT id, email FROM user', (error, results) => {
                    if (error) {
                        errorHandler(error, 'Falha ao listar os usuários.', reject);
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
                        errorHandler(error, 'Falha ao salvar usuário.', reject);
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
                        errorHandler(error, `Falha ao atualizar usuário de id ${id}.`, reject);
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
                        errorHandler(error, `Falha ao remover usuário de id ${id}.`, reject);
                        return false;
                    };
                    resolve({ message: 'Usuário removido com sucesso.', affectedRows: results.affectedRows });
                });
            })
        }
    }
}

module.exports = users;
