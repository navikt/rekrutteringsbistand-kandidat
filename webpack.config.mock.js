const webpack = require('webpack');
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.config.dev.js');

const mockOverride = merge(devConfig, {
    plugins: [
        new webpack.DefinePlugin({
            __MOCK_API__: JSON.stringify(true),
        }),
    ],
});

module.exports = mockOverride;
