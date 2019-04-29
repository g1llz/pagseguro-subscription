# PAGSEGURO-Subscription
This API implements the recurring payment of [PAGSEGURO](https://dev.pagseguro.uol.com.br/docs/pagamento-recorrente). Every contribution is welcome :ok_hand:

NOTE: The documentation is a **work in progress**.

### **Install**

+ npm i to get dependences
+ copy and rename **.env.example** to **.env**, and put your configs..
+ create a user in your DB. (necessary to the get token)
+ finally, **npm run dev** to go!

### **.env (dev environment)**

**PAGSEGURO CREDENTIALS**
*(put your credentials of Pagseguro sandbox)*
```js
PAG_URL=https://ws.sandbox.pagseguro.uol.com.br
PAG_EMAIL=
PAG_TOKEN=
```

**URL TO API SEND NOTIFICATION** 
```js
URL_NOTIFICATION=
```

**JWT**
*(your secret key to decode Json Web Token)*
```js
JWT_SECRET=
```

**APP PORT**
*(the port where your server listen)*
```js
PORT=3456
```

**SLACK NOTIFY**
*(slack credentials to receive errors notifications on channel)*
```js
MY_SLACK_WEBHOOK_URL=
USE_SLACK=true
```

**DB CONFIG**
```js
MYSQL_host=
MYSQL_user=
MYSQL_password=
MYSQL_database=
```

### **PM2 (prod environment)** ##
coming soon ...
