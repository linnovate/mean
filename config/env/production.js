'use strict';

module.exports = {
    db: 'mongodb://localhost/mean',
    app: {
        name: 'MEAN - A Modern Stack - Production'
    },
    facebook: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:'+ process.env.PORT || '' +'/auth/facebook/callback'
    },
    twitter: {
        clientID: 'CONSUMER_KEY',
        clientSecret: 'CONSUMER_SECRET',
        callbackURL: 'http://localhost:'+ process.env.PORT || '' +'/auth/twitter/callback'
    },
    github: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:'+ process.env.PORT || '' +'/auth/github/callback'
    },
    google: {
        clientID: 'APP_ID',
        clientSecret: 'APP_SECRET',
        callbackURL: 'http://localhost:'+ process.env.PORT || '' +'/auth/google/callback'
    },
    linkedin: {
        clientID: 'API_KEY',
        clientSecret: 'SECRET_KEY',
        callbackURL: 'http://localhost:'+ process.env.PORT || '' +'/auth/linkedin/callback'
    }
};
