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
server.use(helmet({
    xssFilter: false,
    noCache: true
}));
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
    PAM_KANDIDATSOK_API_URL: '/pam-kandidatsok/rest/',
    LOGIN_URL: process.env.LOGINSERVICE_URL,
    LOGOUT_URL: process.env.LOGOUTSERVICE_URL,
    PAMPORTAL_URL: process.env.PAMPORTAL_URL,
    BACKEND_OPPE: process.env.PAM_KANDIDATSOK_BACKEND_OPPE === 'true',
    API_GATEWAY: process.env.PAM_KANDIDATSOK_API_URL,
    PROXY_API_KEY: process.env.PAM_KANDIDATSOK_API_PROXY_API_APIKEY
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_KANDIDATSOK_API_URL__="${fasitProperties.PAM_KANDIDATSOK_API_URL}";\n` +
        `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n` +
        `window.__PAMPORTAL_URL__="${fasitProperties.PAMPORTAL_URL}";\n` +
        `window.__BACKEND_OPPE__=${fasitProperties.BACKEND_OPPE};\n`;

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

const startServer = (html) => {
    writeEnvironmentVariablesToFile();

    const proxyHost = fasitProperties.API_GATEWAY.split('://').pop().split('/')[0];

    server.use('/pam-kandidatsok/rest/', proxy(proxyHost, {
        https: true,
        proxyReqPathResolver: (req) => {
            const rettPath = `/pam-kandidatsok-api/pam-kandidatsok-api${req.originalUrl.split('/pam-kandidatsok').pop()}`;
            return rettPath;
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            if (srcReq.headers.cookie !== undefined) {
                const token = srcReq.headers.cookie.split(';').filter((s) => s && s.indexOf('selvbetjening-idtoken') !== -1).pop();
                if (token) {
                    proxyReqOpts.headers.authorization = `Bearer ${token.split('=').pop().trim()}`;
                }
            }
            proxyReqOpts.headers['x-nav-apiKey'] = fasitProperties.PROXY_API_KEY;
            return proxyReqOpts;
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
