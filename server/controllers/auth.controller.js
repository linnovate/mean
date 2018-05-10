const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user.model');
const { verifyToken, generateToken } = require('./token.controller');

// sample user, used for authentication
const user = {
  username: 'react',
  password: 'express'
};

/**
* Returns jwt token if valid username and password is provided
* @param req
* @param res
* @param next
* @returns {*}
*/
function login(params) {
  // Ideally you'll fetch this from the db Idea here was to show how jwt works
  // with simplicity
  return new Promise((resolve, reject) => {
    User
      .findOne({email: params.email})
      .then((user) => {
        if (!user) return resolve({ error: 'user do not exist' });
        if (user.authenticate(params.password)) {
          return resolve({
            user: user.clean(),
            token: generateToken(user)
          });
        }
        resolve({
          error: 'password do not match'
        });
      })
      .catch((err) => {
        console.log(err);
        return resolve({ error: 'user do not exist' });
      });
  });
}

/**
* This is a protected route. Will return random number only if jwt token is provided in header.
* @param req
* @param res
* @returns {*}
*/
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

module.exports = {
  login,
  getRandomNumber,
  verifyToken,
};
