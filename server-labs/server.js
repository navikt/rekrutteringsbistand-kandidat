const express = require('express');
const path = require('path');

const server = express();

const basePath = '/rekrutteringsbistand-kandidat';

const startServer = () => {
    server.get([`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`], (_, res) =>
        res.sendStatus(200)
    );

    const buildPath = path.join(__dirname, 'build');

    server.use(`${basePath}/static`, express.static(buildPath + '/static'));

    server.get([`/kandidater`, `/kandidater/*`], (_, res) => {
        res.sendFile(`${buildPath}/index.html`);
    });

    server.listen(8080, () => {
        console.log(`\nServer for mock av Rekrutteringsbistand har startet!`);
        console.log(`Se "https://rekrutteringsbistand.labs.nais.io/kandidater"`);
    });
};

startServer();
