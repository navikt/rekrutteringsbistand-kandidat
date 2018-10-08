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
            __PAM_KANDIDATSOK_API_URL__: "'http://localhost:8766/pam-kandidatsok-api/rest/'",
            __LOGIN_URL__: "'http://localhost:8766/pam-kandidatsok-api/local/cookie?level=Level3'",
            __LOGOUT_URL__: "'#'",
            __PAMPORTAL_URL__: "'#'",
            __BACKEND_OPPE__: true,
            __CONTEXT_ROOT__: "'pam-kandidatsok'",
            'process.env.NODE_ENV': "'development'"
        })
    ]
});
