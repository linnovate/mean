
var async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/signin', users.signin)
  app.get('/signup', users.signup)
  app.get('/signout', users.signout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/signin', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/me', users.me)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/signin' }), users.signin)
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/signin' }), users.authCallback)
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/signin' }), users.signin)
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/signin' }), users.authCallback)
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/signin' }), users.signin)
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/signin' }), users.authCallback)
  app.get('/auth/google', passport.authenticate('google', { failureRedirect: '/signin', scope: 'https://www.google.com/m8/feeds' }), users.signin)
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/signin', scope: 'https://www.google.com/m8/feeds' }), users.authCallback)

  app.param('userId', users.user)


  // home route
  var index = require('../app/controllers/index')
  app.get('/', index.render)

}
