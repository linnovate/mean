module.exports = function(grunt) {
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            jade: {
                files: ['app/views/**'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['public/js/**', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: ['public/css/**'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: ['gruntfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js']
        },
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['app', 'config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'], 
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.js', '!test/client/**.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            options: {
                autoWatch: true,
                frameworks: ['mocha', 'chai'],
                files: [
                    'public/lib/angular/angular.js',
                    'public/lib/angular-cookies/angular-cookies.js',
                    'public/lib/angular-resource/angular-resource.js',
                    'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                    'public/lib/angular-bootstrap/ui-bootstrap.js',
                    'public/lib/angular-ui-utils/modules/route/route.js',
                    'public/vendor/angular-mocks/angular-mocks.js',
                    'public/js/**/*.js',
                    'test/client/**/*.js'
                ]
            },
            unit: {
                singleRun: false,
            },
            // For a CI
            continuous: {
                singleRun: true,
                browsers: ['PhantomJS']
            }
        }
    });

    //Load NPM tasks 
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-karma');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Default task(s).
    grunt.registerTask('default', ['jshint', 'concurrent']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:continuous']);
};
