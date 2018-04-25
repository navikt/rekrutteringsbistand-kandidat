const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: {
            index: './viewsDev/index.html'
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            __PAM_SEARCH_API__: "'http://localhost:8765/pam-cv-indexer/rest/kandidatsok/'",
            __LOGIN_URL__: "'http://localhost:8765/pam-cv-indexer/local/cookie/'",
            __LOGOUT_URL__: "'#'"
        })
    ]
});
