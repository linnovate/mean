'use strict';

var crypto = require('crypto');

exports.encrypt = function(str, secret) {
 	var cipher = crypto.createCipher('aes192', secret);
 	var enc = cipher.update(str, 'utf8', 'hex');
 	enc += cipher.final('hex');
 	return enc;
};

exports.decrypt = function(str, secret) {
 	var decipher = crypto.createDecipher('aes192', secret);
 	var dec = decipher.update(str, 'hex', 'utf8');
 	dec += decipher.final('utf8');
 	return dec;
};


exports.valueEncrypt = function(value) {
	var rst = '';
	for (var i = 0; i < value.length; i ++) {
		rst += value.charCodeAt(i);
	}
	return rst;
};