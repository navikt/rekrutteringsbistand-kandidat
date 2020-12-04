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

const envPath = 'static/js/env.js';

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.KANDIDAT_LOGIN_URL="${process.env.LOGINSERVICE_VEILEDER_URL}";\n` +
        `window.KANDIDAT_LAST_NED_CV_URL="${process.env.LAST_NED_CV_URL}";\n` +
        `window.KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL="${process.env.ARBEIDSRETTET_OPPFOLGING_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, `build/${envPath}`), fileContent, (err) => {
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

const manifestMedEnvpath = () => {
    const asset = JSON.parse(fs.readFileSync(`${buildPath}/asset-manifest.json`, 'utf8'));
    if (asset.files) {
        const name = envPath.split('/').pop();
        asset.files[name] = `${basePath}/${envPath}`;
    }
    return JSON.stringify(asset, null, 4);
};

const manifest = manifestMedEnvpath();

const startServer = () => {
    writeEnvironmentVariablesToFile();

    app.use(setupProxy(`${basePath}/kandidat-api`, process.env.KANDIDATSOK_API_URL));

    app.use(
        setupProxy(`${basePath}/enhetsregister-api`, process.env.ENHETSREGISTER_API, {
            'x-nav-apiKey': miljøvariablerFraVault.ENHETSREGISTER_GATEWAY_APIKEY,
        })
    );

    app.use(setupProxy(`${basePath}/sms-api`, process.env.SMS_API));

    app.use(`${basePath}/midlertidig-utilgjengelig-api`, [
        fjernDobleCookies,
        setupProxy(
            `${basePath}/midlertidig-utilgjengelig-api`,
            process.env.MIDLERTIDIG_UTILGJENGELIG_API
        ),
    ]);

    app.use(`${basePath}/static`, express.static(buildPath + '/static'));

    app.get(`${basePath}/asset-manifest.json`, (req, res) => {
        res.type('json').send(manifest);
    });

    app.get([`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`], (req, res) =>
        res.sendStatus(200)
    );

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

startServer();
