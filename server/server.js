/* eslint-disable no-param-reassign, no-console */
const path = require('path');
const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

const basePath = '/rekrutteringsbistand-kandidat';
const buildPath = path.join(__dirname, 'build');

const envPath = 'static/js/env.js';
const envFile =
    `window.KANDIDAT_LAST_NED_CV_URL="${process.env.LAST_NED_CV_URL}";\n` +
    `window.KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL="${process.env.ARBEIDSRETTET_OPPFOLGING_URL}";\n`;

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
    app.get(`${basePath}/${envPath}`, (_, res) => {
        res.type('application/javascript').send(envFile);
    });

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
