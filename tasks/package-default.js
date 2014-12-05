'use strict';

// read default tasks from packages
module.exports = function(grunt) {
    grunt.registerTask('package-default', 'Run default package tasks', function() {
        var options = this.options();
        if (options && options.tasks) {
            Object.keys(options.tasks).forEach(function(task) {
                if (task) {
                    grunt.task.run(task);
                }
            });
        }
    });
};