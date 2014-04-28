'use strict';

var fs = require('fs');
var request = require('request');

exports.save = function(req, res) {
    request(req.query.theme, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            fs.writeFile('packages/admin/theme.css', body, function(err) {
                if (err) {
                    console.log(err);
                } else {
                    res.send('saved');
                }
            });
        }
    });
};

exports.get = function(req, res) {
    var filePath = __dirname + '/../../theme.css';
    var readstream = fs.createReadStream(filePath, {
        autoClose: true
    });
    readstream.pipe(res);
};