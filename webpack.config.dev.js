const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devOverride = {
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: {
            index: './viewsDev/index.html',
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            __PAM_KANDIDATSOK_API_URL__: "'http://localhost:8766/pam-kandidatsok-api/rest'",
            __LOGIN_URL__: "'http://localhost:8766/pam-kandidatsok-api/local/cookie-isso'",
            __LOGOUT_URL__: "'#'",
            __PAMPORTAL_URL__: "'#'",
            __PAM_SEARCH_API_GATEWAY_URL__: "'https://pam-search-api.nais.oera-q.local'",
            __BACKEND_OPPE__: true,
            __LAST_NED_CV_URL__: "'https://pam-cv-veileder.nais.preprod.local/cv/pdf'",
            __ARBEIDSRETTET_OPPFOLGING_URL__: "'#'",
            'process.env.NODE_ENV': "'development'",
        }),
    ],
};

const devConfig = merge(commonConfig, devOverride);

module.exports = devConfig;
