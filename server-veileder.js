/* eslint-disable no-param-reassign */
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

server.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'none'"],
        scriptSrc: [
            "'self'",
            'https://www.google-analytics.com',
            "'sha256-3ivVSOxwW5BHJHQdTkksJZIVc1FWOa3/VmxIvm60o2Y='" // sha'en er for at frontend-loggeren skal kunne kjøre som inline-script
        ],
        styleSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
        connectSrc: ["'self'", 'https://www.google-analytics.com']
    }
}));

server.set('views', `${currentDirectory}/views`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const fasitProperties = {
    PAM_SEARCH_API: '/pam-kandidatsok-veileder/rest/veileder/kandidatsok/',
    LOGIN_URL: process.env.LOGIN_URL
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_SEARCH_API__="${fasitProperties.PAM_SEARCH_API}";\n` +
        `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

const renderSok = () => (
    new Promise((resolve, reject) => {
        server.render(
            'index-veileder.html',
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

const startServer = (html) => {
    writeEnvironmentVariablesToFile();

    server.get('/pam-kandidatsok-veileder/internal/isAlive', (req, res) => res.sendStatus(200));
    server.get('/pam-kandidatsok-veileder/internal/isReady', (req, res) => res.sendStatus(200));

    server.use('/pam-kandidatsok-veileder/rest/veileder/kandidatsok/', proxy('http://pam-kandidatsok-api', {
        proxyReqPathResolver: (req) => `/pam-kandidatsok-api${req.originalUrl.split('/pam-kandidatsok-veileder').pop()}`,
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.headers.cookie !== undefined) {
                const token = srcReq.headers.cookie.split(';').filter((s) => s && s.indexOf('ID_token') !== -1).pop();
                if (token) {
                    proxyReqOpts.headers.authorization = `Bearer ${token.split('=').pop().trim()}`;
                }
            }
            return proxyReqOpts;
        }
    }));

    server.use(
        '/pam-kandidatsok-veileder/js',
        express.static(path.resolve(__dirname, 'dist/js'))
    );
    server.use(
        '/pam-kandidatsok-veileder/css',
        express.static(path.resolve(__dirname, 'dist/css'))
    );

    server.get(
        ['/pam-kandidatsok-veileder', '/pam-kandidatsok-veileder/*'],
        (req, res) => {
            res.send(html);
        }
    );

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
        console.log(`Versjon: ${process.env.APP_VERSION}`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderSok()
    .then(startServer, (error) => logError('Failed to render app', error));
