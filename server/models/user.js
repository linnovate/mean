'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

// Change these if needed
var current_method = "pbkdf2";
var current_rounds = 10000;
var current_length = 64;

/**
 * User Schema
 */
var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: String,
    username: {
        type: String,
        unique: true
    },
    roles: [{
        type: String,
        default: 'authenticated'
    }],
    hashed_password: String,
    provider: String,
    hash_method: {
        type: String,
        default: current_method
    },
    hash_rounds: {
        type: Number,
        default: current_rounds
    },
    hash_length: {
        type: Number,
        default: current_length
    },
    salt: String,
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    linkedin: {}
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

// The 4 validations below only apply if you are signing up traditionally.
UserSchema.path('name').validate(function(name) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof name === 'string' && name.length > 0);
}, 'Name cannot be blank');

UserSchema.path('email').validate(function(email) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof email === 'string' && email.length > 0);
}, 'Email cannot be blank');

UserSchema.path('username').validate(function(username) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof username === 'string' && username.length > 0);
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof hashed_password === 'string' && hashed_password.length > 0);
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && !this.provider)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */
UserSchema.methods = {

    /**
     * HasRole - check if the user has required role
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    hasRole: function(role) {
        var roles = this.roles;
        return (roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1);
    },
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        if (this.hashPassword(plainText) === this.hashed_password) {
            if (this.hash_method !== current_method || this.hash_rounds !== current_rounds || this.hash_length !== current_length) {
                this.hash_method = current_method;
                this.hash_rounds = current_rounds;
                this.hash_length = current_length;
                // Password isn't using the latest settings, re-hash it.
                this.hashed_password = this.hashPassword(plainText);
                return true;
            } else {
                return true;
            }
        } else {
            return false;
        }
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
     * Hash password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    hashPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        // Add more cases here if the hash method changes
        if (this.hash_method === "pbkdf2") {
            return crypto.pbkdf2Sync(password, salt, this.rounds, current_length).toString('base64');
        } else {
            // Default to current
            return crypto.pbkdf2Sync(password, salt, this.rounds, current_length).toString('base64');
        }
    }
};

mongoose.model('User', UserSchema);
