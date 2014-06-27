'use strict';

/* Helper for mocha supertest login */

var superagent = require('supertest');
var agent = superagent.agent();


exports.login = function (request, user, done) {
  request
    .post('/login')
    .send({ email:user.email, password:user.password })
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      agent.saveCookies(res);
      done(agent);
    });
};
