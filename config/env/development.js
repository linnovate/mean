'use strict';

module.exports = {
  db: 'mongodb://localhost/mean-dev1',
	debug: 'true',
  mongoose: {
    debug: false
  },
  app: {
    name: 'MEAN - FullStack JS - Development'
  },
  //social: {
    facebook: {
      clientID: 'DEFAULT_APP_ID',
      clientSecret: 'APP_SECRET',
      //scope: ['email', 'user_about_me'],
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },
    twitter: {
      clientID: 'DEFAULT_CONSUMER_KEY',
      clientSecret: 'CONSUMER_SECRET',
      callbackURL: 'http://localhost:3000/auth/twitter/callback'
    },
    github: {
      clientID: 'DEFAULT_APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: 'DEFAULT_APP_ID',
      clientSecret: 'APP_SECRET',
      //scope: [
      //  'https://www.googleapis.com/auth/userinfo.profile',
      //  'https://www.googleapis.com/auth/userinfo.email'
      //],
      callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    linkedin: {
      clientID: 'DEFAULT_API_KEY',
      clientSecret: 'SECRET_KEY',
      //scope: ['r_emailaddress'],
      callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    },
  //},
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER', // Gmail, SMTP
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  }
};
