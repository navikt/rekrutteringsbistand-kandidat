const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prodOverride = {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Kandidatsøk - Tjeneste',
            templateParameters: {
                envVariables:
                    '<script type="text/javascript" src="/kandidater/js/env.js"></script>',
                modiaJs:
                    '<script src="https://internarbeidsflatedecorator.nais.adeo.no/internarbeidsflatedecorator/v2.1/static/js/head.v2.min.js"></script>',
                modiaCss:
                    '<link rel="stylesheet" href="https://internarbeidsflatedecorator.nais.adeo.no/internarbeidsflatedecorator/v2.1/static/css/main.css"></link>',
            },
        }),
    ],
};

const prodConfig = merge(common, prodOverride);

module.exports = prodConfig;
