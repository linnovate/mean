'use strict';

var request = require('request');

exports.save = function(req, res, gfs) {


    gfs.files.findOne({
        filename: 'theme.css'
    }, function(err, file) {

        if (err) return res.send(500, 'Error updating theme');

        // Id of the current theme file
        var _id = (file ? file._id : null);

        // Creating write stream
        var writestream = gfs.createWriteStream({
            filename: 'theme.css'
        });

        //Retrieving theme from source

        request(req.query.theme).pipe(writestream);

        // Remove old theme file

        writestream.on('close', function(file) {

            res.send('saved');

            if (_id && file.filename === 'theme.css') {
                gfs.files.remove({
                    _id: _id
                }, function(err) {
                    console.log(err);
                });
            }
        });

        writestream.on('error', function(file) {

            res.send(500, 'error updating theme');

        });

    });

};

exports.defaultTheme = function(req, res, gfs) {

    gfs.files.findOne({
        filename: 'theme.css'
    }, function(err, file) {

        if (err) return res.send(500, 'Error updating theme');

        // Id of the current theme file
        var _id = (file ? file._id : null);

        if (_id && file.filename === 'theme.css') {
            gfs.files.remove({
                _id: _id
            }, function(err) {
                res.send('saved');
                console.log(err);
            });
        }
    });
};
