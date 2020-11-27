const express = require('express');
const path = require('path');

const server = express();

const startServer = () => {
    server.get(`/internal/isAlive`, (_, res) => res.sendStatus(200));
    server.get(`/internal/isReady`, (_, res) => res.sendStatus(200));

    const buildPath = path.join(__dirname, 'build');

    server.use(
        `/rekrutteringsbistand-kandidat/static/js`,
        express.static(`${buildPath}/static/js`)
    );
    server.use(
        `/rekrutteringsbistand-kandidat/static/css`,
        express.static(`${buildPath}/static/css`)
    );
    server.get([`/kandidater`, `${prefix}/kandidater/*`], (_, res) => {
        res.sendFile(`${buildPath}/index.html`);
    });

    server.listen(8080, () => {
        console.log(`\nServer for mock av Rekrutteringsbistand har startet!`);
        console.log(`Se "https://rekrutteringsbistand.labs.nais.io${prefix}/kandidater"`);
    });
};

startServer();
