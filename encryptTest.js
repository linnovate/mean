var crypto = require('crypto');

var e = function(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

var d = function(str, secret) {
  var decipher = crypto.createDecipher('aes192', secret);
  var dec = decipher.update(str, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}



var tt = function(value) {
	switch(value) {
		case "NIMABI":
		return "骂人干嘛?";
		default: 
		return "haha";
	}
};
console.log(tt("NIMABI"));