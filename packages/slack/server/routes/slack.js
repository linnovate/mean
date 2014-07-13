'use strict';
var posts = require("../controllers/posts");
// The Package is past automatically as first parameter
module.exports = function(Slack, app, auth, database) {

app.post('/slackall/ping',posts.notify);

 app.route('/slackall')
//    .get(posts.all)
    .post(auth.requiresLogin, posts.notify);
	});


    app.get('/slack/all', auth.requiresLogin, function(req, res, next) {
        Slack.render('index', {
            package: 'slack'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
		});
};
