const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

const PATH = {
    production: "'/'",
    development: "'/'",
};

const prodOverride = {
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            __PATH__: PATH['production'],
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        /* Optimize bundle load time */
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UglifyJSPlugin({ sourceMap: true }),
    ],
};

const prodConfig = merge(common, prodOverride);

module.exports = prodConfig;
