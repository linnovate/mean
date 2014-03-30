var mailer = require('nodemailer');
var encrypt = require('../middlewares/encrypt');

var transport = mailer.createTransport('SMTP', {
    host: 'smtp.ym.163.com',
    secureConnection: true, // use SSL
    port: 994, // port for secure SMTP
    auth: {
        user: 'nicoJiang@55yali.com',
        pass: '~!jzl1234'
    }
});

var SITE_ROOT_URL = 'http://127.0.0.1:3000';
/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
  transport.sendMail(data, function (err) {
    if (err) {
      // 写为日志
      console.log(err);
    }
  });
};

/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 */
exports.sendCompanyActiveMail = function (who, name) {
  var from = '动梨无限<nicoJiang@55yali.com>';
  var to = who;
  var subject = name + ' 动梨社区公司账号激活';
  var html = '<p>您好：<p/>' +
    '<p>我们收到您在动梨的申请信息，请点击下面的链接来激活帐户：</p>' +
    '<a href="' + SITE_ROOT_URL + '/company_active_account?key=' + encrypt.encrypt(name,'18801912891') + '&name=' + name + '">激活链接</a>';

  sendMail({
    from: from,
    to: to,
    subject: subject,
    html: html
  });
};