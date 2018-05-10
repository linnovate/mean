const jwt = require('jsonwebtoken');
const config = require('../config/config');


function generateToken(user) {
    const payload = encodeURI(JSON.stringify(user.clean()));
    const token = jwt.sign(payload, config.jwtSecret);
    return token;
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        // find user in DB
        token = token
        .split('Bearer')[1]
        .trim();
        jwt.verify(token, config.jwtSecret, function (err, decoded) {
            return resolve(JSON.parse(decodeURI(decoded)));
        });
    });
}

module.exports = {
    generateToken,
    verifyToken,
};
