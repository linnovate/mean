const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports = {
  generateToken
}


function generateToken(user) {
  const payload = JSON.stringify(user);
  return jwt.sign(payload, config.jwtSecret);
}
