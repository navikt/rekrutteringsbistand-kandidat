const express = require('express');
const path = require('path');

const server = express();

const port = process.env.PORT || 8080;
server.set('port', port);

const startServer = () => {
    server.get('/rekrutteringsbistand-kandidat/internal/isAlive', (req, res) =>
        res.sendStatus(200)
    );
    server.get('/rekrutteringsbistand-kandidat/internal/isReady', (req, res) =>
        res.sendStatus(200)
    );

    server.use(
        '/rekrutteringsbistand-kandidat/kandidater/js',
        express.static(path.resolve(__dirname, '../dist/js'))
    );
    server.use(
        '/rekrutteringsbistand-kandidat/kandidater/css',
        express.static(path.resolve(__dirname, '../dist/css'))
    );

    server.use(
        [
            '/rekrutteringsbistand-kandidat/kandidater',
            '/rekrutteringsbistand-kandidat/kandidater/*',
        ],
        express.static(path.resolve(__dirname, 'index.html'))
    );

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
        console.log(`Versjon: ${process.env.APP_VERSION}`);
    });
};

startServer();
