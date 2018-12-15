const request = require('request-promise');
const convert = require('xml-js');

const headerTransaction = { 'Content-Type': 'application/json;charset=ISO-8859-1' }
const headerPreApproval = { 'Content-Type': 'application/json;charset=ISO-8859-1', 'Accept': 'application/vnd.pagseguro.com.br.v3+xml;charset=ISO-8859-1' }

const notification = deps => {
    const { errorHandler } = deps;
    return {
        receive: (code, type) => {
            const path = type === 'preApproval' ? 'pre-approvals' : 'v3/transactions';
            const options = {
                headers: type === 'transaction' ? headerTransaction : headerPreApproval,
                uri: `${process.env.PAG_url}/${path}/notifications/${type === 'transaction' ? formatCode(code) : code}`,
                qs: { email: process.env.PAG_email, token: process.env.PAG_token },
                method: 'GET'
            }
            return new Promise((resolve, reject) => {
                request(options)
                    .then((res) => {
                        res = convert.xml2js(res, { compact: true, spaces: 4 })
                        resolve({ res })
                    })
                    .catch((err) => {
                        errorHandler(err, reject);
                        return false;
                    });
            });
        }
    }
}

const formatCode = (code) => {
    return [code.substring(0, 6), '-', code.substring(6, 18), '-', code.substring(18, 30), '-', code.substring(30, 36)].join('')
}

module.exports = notification;
