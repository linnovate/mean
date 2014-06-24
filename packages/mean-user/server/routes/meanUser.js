'use strict';

// The Package is past automatically as first parameter
module.exports = function(MeanUser, app, auth, database) {

    app.get('/meanUser/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/meanUser/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/meanUser/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/meanUser/example/render', function(req, res, next) {
        MeanUser.render('index', {
            package: 'mean-user'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
