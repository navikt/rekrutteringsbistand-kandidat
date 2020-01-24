const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = () => ({
    entry: {
        sok: ['babel-polyfill', 'whatwg-fetch', './src/veileder/app.js'],
        googleanalytics: ['./src/felles/googleanalytics.js'],
    },
    output: {
        path: `${__dirname}/dist`,
        filename: 'js/[name].js',
        publicPath: '/sok',
    },
    module: {
        rules: [
            {
                test: /\.([tj])sx?$/,
                exclude: /node_modules\/(?!(autotrack|dom-utils))/,
                use: ['cache-loader', { loader: 'awesome-typescript-loader' }],
                // query: { presets: ['es2015', 'react', 'stage-2'] }
            },
            {
                test: /\.(png)$/,
                use: { loader: 'base64-image-loader' },
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader',
                }),
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'less-loader?{"globalVars":{"nodeModulesPath":"\'./../../\'", "coreModulePath":"\'./../../\'"}}',
                    ],
                }),
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    plugins: [new ExtractTextPlugin('css/[name].css')],
});

module.exports = (() => ({
    common,
}))();
