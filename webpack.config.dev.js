const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const developmentToggles = {
    'vis-manglende-arbeidserfaring-boks': false,
    'vis-ta-kontakt-kandidat': false,
    'skjul-yrke': true,
    'skjul-kompetanse': true,
    'skjul-utdanning': true,
    'skjul-arbeidserfaring': true,
    'skjul-spraak': true,
    'skjul-sted': true
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
            __PAM_SEARCH_API__: "'http://localhost:8766/pam-kandidatsok-api/rest/kandidatsok/'",
            __LOGIN_URL__: "'http://localhost:8766/pam-kandidatsok-api/local/cookie'",
            __LOGOUT_URL__: "'#'",
            'process.env.NODE_ENV': "'development'",
            __DEVELOPMENT_TOGGLES__: JSON.stringify(developmentToggles)
        })
    ]
});
