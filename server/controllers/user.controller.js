const User = require('../models/user.model');
const { generateToken } = require('./token.controller');

/**
* Load user and append to req.
*/
function load(req, res, next, id) {
  User.get(id)
  .then((user) => {
    req.user = user; // eslint-disable-line no-param-reassign
    return next();
  })
  .catch(e => next(e));
}

/**
* Get user
* @returns {User}
*/
function get(req, res) {
  return res.json(req.user);
}

/**
* Create new user
* @property {string} req.body.username - The username of user.
* @property {string} req.body.mobileNumber - The mobileNumber of user.
* @returns {User}
*/
function create(params) {
  
  const user = new User({
    fullname: params.data.fullname,
    username: params.data.username,
    email: params.data.email,
    password: params.data.password,
    mobileNumber: params.data.mobileNumber
  });
  return new Promise((resolve, reject) => {
    user.save(() => {
      const token = generateToken(user);
      return resolve({
        user: user.clean(),
        token: token,
      });
    });
  });
}

/**
* Update existing user
* @property {string} req.body.username - The username of user.
* @property {string} req.body.mobileNumber - The mobileNumber of user.
* @returns {User}
*/
function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.mobileNumber = req.body.mobileNumber;
  
  user.save()
  .then(savedUser => res.json(savedUser))
  .catch(e => next(e));
}

/**
* Get user list.
* @property {number} req.query.skip - Number of users to be skipped.
* @property {number} req.query.limit - Limit number of users to be returned.
* @returns {User[]}
*/
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
  .then(users => res.json(users))
  .catch(e => next(e));
}

/**
* Delete user.
* @returns {User}
*/
function remove(req, res, next) {
  const user = req.user;
  user.remove()
  .then(deletedUser => res.json(deletedUser))
  .catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
