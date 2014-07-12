'use strict';

// The Package is past automatically as first parameter
module.exports = function(Slack, app, auth, database) {

	var SlackInst = require('node-slack');
var meandomain = 'meanio';
var meantoken = 'xoxp-2194933696-2194933708-2443321518-a2df23';
	var slacki = new SlackInst(meandomain,meantoken);
	app.post('/yesman',function(req,res) {

					var reply = slacki.respond(req.body,function(hook) {
						return {
							text: 'Good point, ' + hook.user_name,
							username: 'Bot'
						};

					});

					res.json(reply);

	});


    app.get('/slack/all', auth.requiresLogin, function(req, res, next) {
			res.send('foobar');
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
