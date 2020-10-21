const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const commonConfig = {
    entry: {
        sok: ['babel-polyfill', 'whatwg-fetch', './src/veileder/App.tsx'],
    },
    output: {
        path: `${__dirname}/../dist`,
        filename: 'js/[name].[contenthash:7].js',
        publicPath: '/kandidater',
    },
    module: {
        rules: [
            {
                test: /\.([tj])sx?$/,
                exclude: /node_modules\/(?!(autotrack|dom-utils))/,
                use: ['cache-loader', { loader: 'ts-loader' }],
            },
            {
                test: /\.(png)$/,
                use: { loader: 'base64-image-loader' },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
    ],
};

module.exports = commonConfig;
