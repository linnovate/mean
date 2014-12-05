'use strict';

var glob = require('glob'),
    path = require('path'),
    fs = require('fs');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('sasscompile', 'Compile sass files', function() {
    var options = this.options(),
      paths = options.search,
      loadPath = options.loadPath;

    var files = [];
    paths.forEach(function(path) {
        glob.sync(path).forEach(function(file) {
            files.push(file);
        });
    });
    if (!files.length) {
      return;
    }

    var filesToCompile = {},
      compileSass = false;
    files.forEach(function(file) {
      var basename = path.basename(file);
      if (basename.match(/^[^_]/)) {
        var compiledFile = path.dirname(file)+'/../css/'+path.basename(file, '.scss')+'.compiled.css';
        // conditionally run sass task only if necessary
        if (!fs.existsSync(compiledFile)) {
          grunt.log.writeln('compiling: ' + file + ' => ' + compiledFile);
          compileSass = true;
        } else {
          var compiledStat = fs.statSync(compiledFile),
            sassStat = fs.statSync(file);
          if (sassStat.mtime > compiledStat.mtime) {
            console.log('recompiling: ' + file + ' => ' + compiledFile);
            compileSass = true;
          }
        }
        filesToCompile[compiledFile] = file;
      }
    });

    if (compileSass) {
      grunt.config('sass', {
          dist: {
            options: {
              loadPath: loadPath
            },
            files: filesToCompile
          }
        });
      grunt.task.run('sass');
    }
  });
};