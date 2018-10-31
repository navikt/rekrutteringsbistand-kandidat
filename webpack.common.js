const ExtractTextPlugin = require('extract-text-webpack-plugin');

const APP = {
    KANDIDATSOK: 'KANDIDATSOK',
    KANDIDATSOK_VEILEDER: 'KANDIDATSOK_VEILEDER'
};

const common = (app) => ({
    entry: {
        sok: [
            'babel-polyfill',
            'whatwg-fetch',
            app === APP.KANDIDATSOK_VEILEDER ? './src/veileder/app.js' : './src/sok/sok.js'
        ],
        googleanalytics: ['./src/googleanalytics.js']
    },
    output: {
        path: `${__dirname}/dist`,
        filename: 'js/[name].js',
        publicPath: app === APP.KANDIDATSOK_VEILEDER ? '/sok' : '/kandidater/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(autotrack|dom-utils))/,
                loader: 'babel-loader',
                query: { presets: ['es2015', 'react', 'stage-2'] }
            }, {
                test: /\.(png)$/,
                loader: 'base64-image-loader'
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'less-loader?{"globalVars":{"nodeModulesPath":"\'./../../\'", "coreModulePath":"\'./../../\'"}}'
                    ]
                })
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
        new ExtractTextPlugin('css/[name].css')
    ]
});

module.exports = (() => ({
    APP,
    common
}))();
