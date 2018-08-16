const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const developmentToggles = {
    'vis-manglende-arbeidserfaring-boks': false,
    'vis-ta-kontakt-kandidat': false,
    'janzz-enabled': true,
    'skjul-yrke': false,
    'skjul-kompetanse': false,
    'skjul-utdanning': false,
    'skjul-arbeidserfaring': false,
    'skjul-spraak': false,
    'skjul-sted': false
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
            __PAMPORTAL_URL__: "'#'",
            __BACKEND_OPPE__: true,
            'process.env.NODE_ENV': "'development'",
            __DEVELOPMENT_TOGGLES__: JSON.stringify(developmentToggles)
        })
    ]
});
