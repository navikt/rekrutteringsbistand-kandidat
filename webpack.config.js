const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { common } = require('./webpack.common.js');

const PATH = {
    production: "'/'",
    development: "'/'"
};

module.exports = () => {
    const environment = 'production';

    return (
        merge(common(), {
            devtool: 'source-map',
            plugins: [
                new webpack.DefinePlugin({
                    __PATH__: PATH[environment],
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                /* Optimize bundle load time */
                new webpack.optimize.ModuleConcatenationPlugin(),
                new UglifyJSPlugin({ sourceMap: true })
            ]
        })
    );
};
