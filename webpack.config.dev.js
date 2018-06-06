const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const developmentToggles = {
    'pam-kandidatsok.toggle-test': true
};

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
            __PAM_FEATURE_TOGGLE_API__: "'http://localhost:8765/pam-cv-indexer/rest/'",
            __LOGIN_URL__: "'http://localhost:8765/pam-cv-indexer/local/cookie'",
            __LOGOUT_URL__: "'#'",
            'process.env.NODE_ENV': "'development'",
            __DEVELOPMENT_TOGGLES__: JSON.stringify(developmentToggles)
        })
    ]
});
