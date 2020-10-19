const { merge } = require('webpack-merge');
const mockConfig = require('./webpack.config.mock.js');

const config = merge(mockConfig, {
    output: {
        publicPath: '/rekrutteringsbistand/kandidater',
    },
});

module.exports = config;
