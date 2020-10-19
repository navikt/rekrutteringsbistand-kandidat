const express = require('express');
const path = require('path');

const server = express();

const prefix = `/rekrutteringsbistand`;

const startServer = () => {
    server.get(`${prefix}/internal/isAlive`, (_, res) => res.sendStatus(200));
    server.get(`${prefix}/internal/isReady`, (_, res) => res.sendStatus(200));

    const build = path.resolve(__dirname, '../dist');

    server.use(`${prefix}/kandidater/js`, express.static(`${build}/js`));
    server.use(`${prefix}/kandidater/css`, express.static(`${build}/css`));
    server.get([`${prefix}/kandidater`, `${prefix}/kandidater/*`], (_, res) => {
        res.sendFile(`${build}/index.html`);
    });

    server.listen(8080, () => {
        console.log(`\nServer for mock av Rekrutteringsbistand har startet!`);
        console.log(`Se "https://arbeidsgiver.labs.nais.io${prefix}/kandidater"`);
    });
};

startServer();
