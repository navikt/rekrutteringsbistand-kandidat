const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const PATH = {
    production: "'/'",
    development: "'/'",
};

const prodOverride = {
    mode: 'production',
    devtool: 'cheap-source-map',
    plugins: [
        new webpack.DefinePlugin({
            __PATH__: PATH['production'],
        }),
    ],
};

const prodConfig = merge(common, prodOverride);

module.exports = prodConfig;
