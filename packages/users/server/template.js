'use strict';

module.exports = {
    forgot_password_email: function(user,req, token, mailOptions) {
        mailOptions.html = 'Hey ' + user.name + '<br/> You are trying to reset ur password. Click on the link below to reset ur password' + 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/#!/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n';
        mailOptions.subject = 'Resetting the password';
        mailOptions.from = 'SENDER EMAIL ADDRESS'; // sender address
        return mailOptions;
    }
};
