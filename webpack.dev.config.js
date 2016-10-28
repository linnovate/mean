'use strict'

var webpack = require('webpack')
var config = require('./webpack.config')
var merge = require('lodash').merge

module.exports = merge(config, {
  entry: ['./app.js', 'webpack-hot-middleware/client?reload=true'],
  output: {
    publicPath: '/bundle/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
});