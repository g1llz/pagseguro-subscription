module.exports = {
    apps: [{
        name: 'pseg',
        script: './src/index.js',
        instances: 0,
        exec_mode: 'cluster',
        env: {
            PAG_URL: 'https://ws.pagseguro.uol.com.br',
            PAG_EMAIL: 'XXXXXX@XXXXXX.XXX.XX',
            PAG_TOKEN: 'XXXXXX',
            URL_NOTFICATION: 'XXXXXX',
            JWT_SECRET: 'XXXXXX',
            PORT: 3003,
            MY_SLACK_WEBHOOK_URL: 'XXXXXX',
            USE_SLACK: true,
            MYSQL_host: 'XXXXXX',
            MYSQL_user: 'XXXXXX',
            MYSQL_password: 'XXXXXX',
            MYSQL_database: 'XXXXXX'
        }
    }]
}
