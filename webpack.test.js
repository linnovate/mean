'use strict';

module.exports = {
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|lib)/,
                loader: 'babel?presets[]=es2015&presets[]=stage-1'
            },
            {
                test: /(.*)\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'url-loader'
            }
        ]
    },
    resolve: {
        modulesDirectories: ['bower_components', 'node_modules']
    }
};
