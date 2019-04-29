# PAGSEGURO-Subscription
This API implements the recurring payment of [PAGSEGURO](https://dev.pagseguro.uol.com.br/docs/pagamento-recorrente). Every contribution is welcome :ok_hand:

NOTE: The documentation is a **work in progress**.


### **Install**

+ npm i to get dependences
+ copy and rename **.env.example** to **.env**, and put your configs..
+ create a user in your DB. (necessary to the get token)
+ finally, **npm run dev** to go!


### **.ENV (dev environment)**

**Credentials**
*(put your credentials of Pagseguro sandbox)*
```js
PAG_URL=https://ws.sandbox.pagseguro.uol.com.br
PAG_EMAIL=
PAG_TOKEN=
```

**URL to send return of pagseguro notifications**

Put here the URL that receives the return of all notifications send by Pagseguro. They send all status change of signature through these notifications.
```js
URL_NOTIFICATION=
```

**JWT**
*(your secret key to decode Json Web Token)*
```js
JWT_SECRET=
```

**Port**
*(the port where your server listen)*
```js
PORT=3456
```

**Slack notify**
*(slack credentials to receive errors notifications on channel)*
```js
MY_SLACK_WEBHOOK_URL=
USE_SLACK=true
```

**DB config**
```js
MYSQL_host=
MYSQL_user=
MYSQL_password=
MYSQL_database=
```


### **PM2 (prod environment)**

Change the file **ecosystem.config.js** with your production credentials :smile:
```js
apps: [{
        name: 'pagseguro-sub',
        script: './src/index.js',
        instances: 0,
        exec_mode: 'cluster',
        env: {
            PAG_URL: 'https://ws.pagseguro.uol.com.br',
            PAG_EMAIL: 'XXXXXX@XXXXXX.XXX.XX',
            PAG_TOKEN: 'XXXXXX',
            URL_NOTFICATION: 'XXXXXX',
            JWT_SECRET: 'XXXXXX',
            PORT: XXXX,
            MY_SLACK_WEBHOOK_URL: 'XXXXXX',
            MYSQL_host: 'XXXXXX',
            MYSQL_user: 'XXXXXX',
            MYSQL_password: 'XXXXXX',
            MYSQL_database: 'XXXXXX'
        }
    }]
```

### **START PM2**
```
pm2 start ecosystem.config.js
```
