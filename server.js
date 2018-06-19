const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const fs = require('fs');
const Promise = require('promise');
const { initialize, isEnabled } = require('unleash-client');

initialize({
    url: process.env.UNLEASH_API_URL,
    appName: 'pam-kandidatsok',
    instanceId: `pam-kandidatsok-${process.env.FASIT_ENVIRONMENT_NAME}`
});

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
    PAM_SEARCH_API: '/pam-kandidatsok/rest/kandidatsok/',
    LOGIN_URL: process.env.LOGINSERVICE_URL,
    LOGOUT_URL: process.env.LOGOUTSERVICE_URL
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_SEARCH_API__="${fasitProperties.PAM_SEARCH_API}";\n` +
        `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

const renderSok = () => (
    new Promise((resolve, reject) => {
        server.render(
            'index.html',
            fasitProperties,
            (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(html);
                }
            }
        );
    })
);

const brukKandidatsokApiToggleNavn = 'pam-kandidatsok.bruk-kandidatsok-api';

const selectProxyHost = () => {
    console.log('featureToggleApi:', isEnabled(brukKandidatsokApiToggleNavn));
    if (isEnabled(brukKandidatsokApiToggleNavn)) {
        console.warn('Gå mot kandidatsok-api');
        return 'http://pam-kandidatsok-api';
    }
    console.warn('Gå mot cv-indexer');
    return 'http://pam-cv-indexer';
};

const startServer = (html) => {
    writeEnvironmentVariablesToFile();

    server.use('/pam-kandidatsok/rest/kandidatsok/', proxy(selectProxyHost, {
        proxyReqPathResolver: (req) => {
            if (isEnabled(brukKandidatsokApiToggleNavn)) {
                const u = `/pam-kandidatsok-api${req.originalUrl.split('/pam-kandidatsok').pop()}`;
                console.warn('Gå mot kandidatsok-api, path:', u);
                return u;
            }
            const u = `/pam-cv-indexer${req.originalUrl.split('/pam-kandidatsok').pop()}`;
            console.warn('Gå mot cv-indexer, path:', u);
            return u;
        }
    }));

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
            res.send(html);
        }
    );

    server.get('/pam-kandidatsok/internal/isAlive', (req, res) => res.sendStatus(200));
    server.get('/pam-kandidatsok/internal/isReady', (req, res) => res.sendStatus(200));

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderSok()
    .then(startServer, (error) => logError('Failed to render app', error));
