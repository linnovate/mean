'use strict';

// The Package is past automatically as first parameter
module.exports = function(Slack, app, auth, database) {

    app.get('/slack/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/slack/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/slack/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/slack/example/render', function(req, res, next) {
        Slack.render('index', {
            package: 'slack'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
