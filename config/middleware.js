'use strict';

/*
var crypto = require('crypto');

var PERMISSION = ["MANAGER","EMPLOYEE","TEAMLEADER"];
var cookie_check = function (value, sccret) {
	return decrypt(value, secret);
};
//next函数是最后的验证:数据库验证
exports.auth_user = function (req, res, next) {
	if (req.session.user) { //session存在
		switch(req.session.user.permission) {
			//HR权限
			case PERMISSION[0]:

			break;
			//组长权限
			case PERMISSION[2]:
			
			break;
			//员工权限
			case PERMISSION[1]:

			break;
			default:break;
		}
	} else { //session不存在,检测cookie
		var cookie = req.cookies[config.auth_cookie_name];
		//如果cookie也不存在,那么只好查询数据库了
    	if (!cookie) {
      		next();
    	} else {
    		var auth_token = decrypt(cookie, config.session_secret);
    		var auth = auth_token.split('\t');
    		var username = auth[0];
    		var permission = auth[1];

    		if (permission == cookie_check(username)) {
    			req.session.user.username = username;
    			req.session.user.permission = auth[2];
    			return true;
    		} 
    		return false;
    	}
	}
};
// private
function gen_session(user, res) {
  var auth_token = encrypt(user.username + '\t' + encrypt(user.username) + '\t' + user.pass + '\t' + user.email, config.session_secret);
  res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天
}

exports.gen_session = gen_session;

function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

function decrypt(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}
*/