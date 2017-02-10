'use strict';

var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('../../webpack.dev.config');
var compiler = webpack(webpackConfig);

module.exports = function (app) {
    app.use(webpackMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        watchOptions: {
            aggregateTimeout: 300
        },
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler))
};

