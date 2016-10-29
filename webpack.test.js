'use strict'

module.exports = {
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },{
      test: /\.scss$/,
      loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components|lib)/,
      loader: 'babel?presets[]=es2015&presets[]=stage-1'
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url'
    }]
  },
  resolve: {
    modulesDirectories: ['bower_components', 'node_modules']
  }
}