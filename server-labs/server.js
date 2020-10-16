const express = require('express');
const path = require('path');

const server = express();

const prefix = `/rekrutteringsbistand-kandidat`;

const startServer = () => {
    server.get(`${prefix}/internal/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`${prefix}/internal/isReady`, (req, res) => res.sendStatus(200));
    server.use(`${prefix}/kandidater/js`, express.static(path.resolve(__dirname, '../dist/js')));
    server.use(`${prefix}/kandidater/css`, express.static(path.resolve(__dirname, '../dist/css')));

    server.use(
        [`${prefix}/kandidater`, `${prefix}/kandidater/*`],
        express.static(path.resolve(__dirname, '../dist/index.html'))
    );

    server.listen(8080, () => {
        console.log(`\nServer for mock av Rekrutteringsbistand har startet!`);
        console.log(`Se "https://arbeidsgiver.labs.nais.io${prefix}/kandidater"`);
    });
};

startServer();
