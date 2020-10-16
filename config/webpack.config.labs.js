const { merge } = require('webpack-merge');
const mockConfig = require('./webpack.config.mock.js');

const config = merge(mockConfig, {
    output: {
        publicPath: '/rekrutteringsbistand-kandidat/kandidater',
    },
});

module.exports = config;
