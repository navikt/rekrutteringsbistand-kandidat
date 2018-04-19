const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const fs = require('fs');
const Promise = require('promise');

const currentDirectory = __dirname;

const server = express();
const port = process.env.PORT || 8080;
server.set('port', port);

server.disable('x-powered-by');
server.use(helmet({ xssFilter: false }));
server.use(helmet({
    xssFilter: false,
    noCache: true
}));

server.set('views', `${currentDirectory}/views`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const fasitProperties = {
    PAM_SEARCH_API: '/pam-kandidatsok/rest/kandidatsok/'
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_SEARCH_API__="${fasitProperties.PAM_SEARCH_API}";\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

const renderSok = (htmlPages) => (
    new Promise((resolve, reject) => {
        server.render(
            'index.html',
            fasitProperties,
            (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Object.assign({ sok: html }, htmlPages));
                }
            }
        );
    })
);

const startServer = (htmlPages) => {
    writeEnvironmentVariablesToFile();

    server.use(
        '/pam-kandidatsok/rest/kandidatsok/',
        proxy('http://pam-cv-indexer/rest/kandidatsok/')
    );

    server.use(
        '/pam-kandidatsok/js',
        express.static(path.resolve(__dirname, 'dist/js'))
    );
    server.use(
        '/pam-kandidatsok/css',
        express.static(path.resolve(__dirname, 'dist/css'))
    );

    server.get(
        ['/', '/pam-kandidatsok/?', /^\/pam-kandidatsok\/(?!.*dist).*$/],
        (req, res) => {
            res.send(htmlPages.sok);
        }
    );

    server.get('/pam-kandidatsok/internal/isAlive', (req, res) => res.sendStatus(200));
    server.get('/pam-kandidatsok/internal/isReady', (req, res) => res.sendStatus(200));

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderSok({})
    .then(startServer, (error) => logError('Failed to render app', error));
