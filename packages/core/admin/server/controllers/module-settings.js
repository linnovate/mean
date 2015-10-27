var Module = require('meanio').Module;

exports.get = function(req, res) {
	var _module = new Module(req.params.name);

	_module.settings(function(err, settings) {
		if (err) return res.status(500).send(err);
		if (settings) return res.jsonp(settings.settings);
		res.jsonp({});
	});
};

exports.save = function(req, res) {
	var _module = new Module(req.params.name);
	var settings = req.body;

	_module.settings(settings, function (err, settings) {
		if (err) return res.status(500).send(err);
		res.jsonp(settings.settings);
	});
};

exports.update = function(req, res) {
	var _module = new Module(req.params.name);
	var updatedSettings = req.body;

	_module.settings(function(err, settings) {
		if (!settings) settings = {};
		else settings = settings.settings;

		if (err) return res.status(500).send(err);
		for (var index in updatedSettings)
			settings[index] = updatedSettings[index];

		_module.settings(settings, function (err, settingsObj) {
			if (err) return res.status(500).send(err);
			res.jsonp(settingsObj);
		});
	});
};