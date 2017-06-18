process.env.NODE_ENV='development'
process.env.PORT='4040'
process.env.JWT_SECRET='0a6b944d-d2fb-46fc-a85e-0295c986cd9f'
process.env.MONGO_HOST='mongodb://localhost/new-mean'
process.env.MONGO_PORT='27017'
require('babel-register');
require("babel-polyfill");
require('./server');