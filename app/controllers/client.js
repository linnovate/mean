/**
**	This controller is meant to render the html views for the Angular Client App
**/

var jade = require('jade');
var fs = require('fs');
var path = require('path');

exports.getView = function(req, res) {
	var viewName = req.params.view;
	var viewPath = path.dirname(require.main.filename) + '/clientViews/' + viewName + '.jade';

	if( !fs.existsSync(viewPath) ) {
	  // view doesn't exist, in my case I want a 404
	  return res.status(404).send('404 Not found<BR><BR>View "' + viewName + '" not found');
	}

	var jadetemplate = jade.compile(fs.readFileSync(viewPath, 'utf8'));

	var html = jadetemplate({});

	res.send(html);
};
