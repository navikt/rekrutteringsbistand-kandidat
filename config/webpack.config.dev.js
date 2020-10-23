const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devOverride = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/kandidater/midlertidig-utilgjengelig': {
                target: 'http://localhost:8080/finn-kandidat-api',
                changeOrigin: true,
                pathRewrite: { '^/kandidater': '' },
            },
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            __PAM_KANDIDATSOK_API_URL__:
                "'http://localhost:8766/rekrutteringsbistand-kandidat-api/rest'",
            __LOGIN_URL__:
                "'http://localhost:8766/rekrutteringsbistand-kandidat-api/local/cookie-isso'",
            __LOGOUT_URL__: "'#'",
            __PAMPORTAL_URL__: "'#'",
            __PAM_SEARCH_API_GATEWAY_URL__: "'https://pam-search-api.nais.oera-q.local'",
            __BACKEND_OPPE__: true,
            __LAST_NED_CV_URL__: "'https://pam-cv-veileder.nais.preprod.local/cv/pdf'",
            __ARBEIDSRETTET_OPPFOLGING_URL__: "'#'",
            __MIDLERTIDIG_UTILGJENGELIG_PROXY__: "'/kandidater/midlertidig-utilgjengelig'",
            __SMS_PROXY__: "'/kandidater/api/sms'",
        }),
        new HtmlWebpackPlugin({
            title: 'Kandidatsøk (TEST)',
            templateParameters: {
                envVariables: '',
                modiaJs:
                    '<script src="https://navikt.github.io/internarbeidsflatedecorator/v2.1/static/js/head.v2.min.js"></script>',
                modiaCss:
                    '<link rel="stylesheet" href="https://navikt.github.io/internarbeidsflatedecorator/v2.1/static/css/main.css"></link>',
            },
        }),
    ],
};

const devConfig = merge(commonConfig, devOverride);

module.exports = devConfig;
