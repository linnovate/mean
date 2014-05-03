'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var crypto = require(crypto);


var CompanyRegisterInivteCode = new Schema({

    code: {
        type: String,
        unique: true
    }

});

CompanyRegisterInivteCode.pre('save', function(next) {
    if (!this.code) {
        var salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.code = crypto.pbkdf2Sync(Date.now().toString(), salt, 10000, 64).toString('base64');
    }

});

mongoose.model('CompanyRegisterInivteCode', CompanyRegisterInivteCode);
