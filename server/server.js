/* eslint-disable no-param-reassign, no-console */
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fjernDobleCookies = require('./cookies');

const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

const basePath = '/rekrutteringsbistand-kandidat';
const buildPath = path.join(__dirname, 'build');

const miljøvariablerFraVault = {
    ENHETSREGISTER_GATEWAY_APIKEY: process.env.PAM_KANDIDATSOK_VEILEDER_PROXY_API_APIKEY,
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.KANDIDAT_LOGIN_URL="${process.env.LOGINSERVICE_VEILEDER_URL}";\n` +
        `window.KANDIDAT_LAST_NED_CV_URL="${process.env.LAST_NED_CV_URL}";\n` +
        `window.KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL="${process.env.ARBEIDSRETTET_OPPFOLGING_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, 'build/static/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

const setupProxy = (fraPath, tilTarget, headers = undefined) =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        headers: headers,
        pathRewrite: (path) => {
            const nyPath = path.replace(fraPath, '');
            console.warn(`~> Proxy fra '${path}' til '${tilTarget + nyPath}'`);

            return nyPath;
        },
    });

const startServer = () => {
    writeEnvironmentVariablesToFile();

    app.use(`${basePath}/static`, express.static(buildPath + '/static'));

    const assetString = fs.readFileSync(`${buildPath}/asset-manifest.json`, 'utf8');
    const asset = JSON.parse(assetString);
    console.log('asset original', asset);
    if (asset.files) {
        asset.files['env.js'] = '/rekrutteringsbistand-kandidat/static/js/env.js';
    }
    console.log('asset endret', asset);
    app.get(`${basePath}/asset-manifest.json`, () => {
        res.send(asset);
    });

    app.get([`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`], (req, res) =>
        res.sendStatus(200)
    );

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

startServer();
