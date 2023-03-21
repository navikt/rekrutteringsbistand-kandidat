import path from 'path';
import express from 'express';
import compression from 'compression';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 8080;

const envPath = 'assets/js/env.js';
const envFile =
    `window.KANDIDAT_LAST_NED_CV_URL="${process.env.LAST_NED_CV_URL}";\n` +
    `window.KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL="${process.env.ARBEIDSRETTET_OPPFOLGING_URL}";\n`;

const basePath = '/rekrutteringsbistand-kandidat';
const buildPath = path.join(__dirname, '../dist');

const startServer = (manifest: string) => {
    app.use(compression());

    app.get(`${basePath}/${envPath}`, (_, res) => {
        res.type('application/javascript').send(envFile);
    });

    app.use(`${basePath}/assets`, express.static(buildPath + '/assets'));
    app.get(`${basePath}/asset-manifest.json`, (_, res) => {
        res.type('json').send(manifest);
    });

    app.get([`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`], (_, res) =>
        res.sendStatus(200)
    );

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

const opprettManifestMedEnvFil = (): string => {
    const asset = JSON.parse(fs.readFileSync(`${buildPath}/asset-manifest.json`, 'utf8'));
    if (asset.files) {
        const name = envPath.split('/').pop();
        asset.files[name] = `${basePath}/${envPath}`;
    }
    return JSON.stringify(asset, null, 4);
};

const initializeServer = () => {
    const manifest = opprettManifestMedEnvFil();
    startServer(manifest);
};

initializeServer();
