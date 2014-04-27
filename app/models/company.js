'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');


var _leader = new Schema({
    uid : String,
    nickname : String
});

var _group = new Schema({
    gid: String,
    group_type: String,
    entity_type: String,           //对应的增强组件名字
    tname: String,                 //小队名称,这是很关键的关键字!
    leader:[_leader]
});
/**
 * Company Schema
 */
var CompanySchema = new Schema({

    id: String,
    username: {
        type: String,
        unique: true
    },
    login_email: String,
    hashed_password: String,

    email: {
        domain: Array               //邮箱后缀(多个)
    },

    //是否激活
    status: {
        active: {
            type: Boolean,
            default: false
        },

        date: Number
    },

    //公司信息
    info: {
        name: {
            type: String,
            unique: true
        },                           //公司名

        city: {
            province: String,
            city: String
        },
        address: String,
        phone: String,

        //固话
        lindline: {
            areacode: String,         //区号
            number: String,           //号码
            extension: String         //分机
        },
        linkman: String,              //联系人
        email: String,
        brief: String,
        official_name: String
    },

    register_date: {
        type: Date,
        default: Date.now()
    },
    //公司内部组件
    group: [_group],
    provider: {
        type: String,
        default: 'company'
    },
    salt: String
});

/**
 * Virtuals
 */
CompanySchema.virtual('password').set(function(password) {
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

// The 4 validations below only apply if you are signing up traditionally.
CompanySchema.path('info.name').validate(function(name) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof name === 'string' && name.length > 0);
}, 'Name cannot be blank');


CompanySchema.path('username').validate(function(username) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof username === 'string' && username.length > 0);
}, 'Username cannot be blank');

CompanySchema.path('hashed_password').validate(function(hashed_password) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    if (!this.provider) return true;
    return (typeof hashed_password === 'string' && hashed_password.length > 0);
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
CompanySchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password) && !this.provider)
        next(new Error('Invalid password'));
    else
        next();
});

/**
 * Methods
 */
CompanySchema.methods = {
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

CompanySchema.statics.eptPass = function(password) {
    return this.encryptPassword(password);
};

mongoose.model('Company', CompanySchema);
