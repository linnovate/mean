'use strict';

// Requires meanio .
var mean = require('meanio');
var cluster = require('cluster');


// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {


// Creates and serves mean application
mean.serve({ workerid:cluster.worker.id /* more options placeholder*/ }, function(app, config) {
    app.workerid = cluster.worker.id;
	var port = config.https && config.https.port ? config.https.port : config.http.port;
	console.log('Mean app started on port ' + port + ' (' + process.env.NODE_ENV + ')');
});

    console.log('Worker ' + cluster.worker.id + ' running!');

}
