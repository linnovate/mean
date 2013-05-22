
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      postmarkKey: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }

module.exports = {
  development: {
    // db: 'mongodb://localhost/mean-dev',
    db: 'mongodb://admin:password@ds027308.mongolab.com:27308/meanstack',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'MEAN - A Modern Stack - Development'
    },
    facebook: {
      clientID: "455818271176818",
      clientSecret: "db6c579d1fcdc9a3980bc4aade0e3aaf",
      callbackURL: "http://local.meanstack.com:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
  },
  test: {
    //db: 'mongodb://localhost/mean-test',
    db: 'mongodb://admin:password@ds027308.mongolab.com:27308/meanstack',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'MEAN - A Modern Stack - Test'
    },
    facebook: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  production: {
    //db: 'mongodb://localhost/mean-test',
    db: 'mongodb://admin:password@ds027308.mongolab.com:27308/meanstack',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'MEAN - A Modern Stack - Production'
    },
    facebook: {
      clientID: "455818271176818",
      clientSecret: "db6c579d1fcdc9a3980bc4aade0e3aaf",
      callbackURL: "http://meanstack.heroku.com/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  }
}
