'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    validate = require('mongoose-validate'),
    crypto = require('crypto');

/**
 * User Schema
 */
var UserSchema = new Schema({
/*    email: {
        type: String,
        validate: [validate.email, '请填写有正确的邮箱地址']
    },*/
    active: {
        type: Boolean,
        default: false
    },
    hashed_password: String,
    provider: {
        type: String,
        default: 'user'
    },
    salt: String

/*    nickname: String,
    realname: String,
    company_id: String,
    department: String,
    position: String,
    sex: {
        type: String,
        enum: ['男', '女']
    },
    birthday: {
        type: Date
    },
    bloodType: {
        type: String,
        enum: ['AB', 'A', 'B', 'O' ]
    },
    introduce: {
        type: String
    },
    registerDate: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: String
    },
    qq: {
        type: String,
        validate: [validate.numeric, '请填写正确的QQ号']
    }*/
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};


/**
 * Pre-save hook
 */
/*UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && !this.provider)
        next(new Error('Invalid password'));
    else
        next();
});*/

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

mongoose.model('User', UserSchema);