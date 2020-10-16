const webpack = require('webpack');
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.config.dev.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = merge(devConfig, {
    output: {
        publicPath: '/kandidater',
    },
    plugins: [
        new webpack.DefinePlugin({
            __MOCK_API__: JSON.stringify(true),
        }),
        new HtmlWebpackPlugin({
            title: 'Kandidatsøk (TEST)',
            templateParameters: {
                envVariables: '',
                modiaJs:
                    '<script src="https://navikt.github.io/internarbeidsflatedecorator/v2.1/static/js/head.v2.min.js"></script>',
                modiaCss:
                    '<link rel="stylesheet" href="https://navikt.github.io/internarbeidsflatedecorator/v2.1/static/css/main.css"></link>',
            },
        }),
    ],
});

module.exports = config;
