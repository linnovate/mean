module.exports = function(mean) {
	// Event for modules when they are ready. We expose this to the modules
	mean.ready = function(data) {
		mean.modules.push(data)
		return mean.events.emit('ready', data);
	}

}