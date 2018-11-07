/* eslint-disable no-param-reassign, no-console */
const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const fs = require('fs');
const Promise = require('promise');
const { isNullOrUndefined } = require('util');
const jwt = require('jsonwebtoken');

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

const isProd = process.env.NODE_ENV !== 'development';

const fasitProperties = {
    PAM_KANDIDATSOK_API_URL: '/pam-kandidatsok-veileder/rest',
    PAM_SEARCH_API: '/pam-kandidatsok-veileder/rest/veileder/kandidatsok/',
    LOGIN_URL: process.env.LOGINSERVICE_VEILEDER_URL,
    LOGOUT_URL: process.env.LOGINSERVICE_LOGOUT_VEILEDER_URL,
    USE_JANZZ: process.env.PAM_KANDIDATSOK_USE_JANZZ === 'true'
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_KANDIDATSOK_API_URL__="${fasitProperties.PAM_KANDIDATSOK_API_URL}";\n` +
        `window.__PAM_SEARCH_API__="${fasitProperties.PAM_SEARCH_API}";\n` +
        `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n` +
        `window.__USE_JANZZ__=${fasitProperties.USE_JANZZ};\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

const normalizedTokenExpiration = (token) => {
    const expiration = jwt.decode(token).exp;
    if (expiration.toString().length === 10) {
        return expiration * 1000;
    }
    return expiration;
};

const unsafeTokenIsExpired = (token) => {
    if (token) {
        const normalizedExpirationTime = normalizedTokenExpiration(token);
        return normalizedExpirationTime - Date.now() < 0;
    }
    return true;
};

const extractTokenFromCookie = (cookie) => {
    if (cookie !== undefined) {
        const token = cookie.split(';').filter((s) => s && s.indexOf('-idtoken') !== -1).pop();
        if (token) {
            return token.split('=').pop().trim();
        }
    }
    return null;
};

const tokenValidator = (req, res, next) => {
    const token = extractTokenFromCookie(req.headers.cookie);
    if (isNullOrUndefined(token) || unsafeTokenIsExpired(token)) {
        const protocol = isProd ? 'https' : req.protocol; // produksjon får også inn http, så må tvinge https der
        const redirectUrl = `${fasitProperties.LOGIN_URL}?redirect=${protocol}://${req.get('host')}/pam-kandidatsok-veileder`;
        return res.redirect(redirectUrl);
    }
    return next();
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
        proxyReqPathResolver: (req) => `/pam-kandidatsok-api${req.originalUrl.split('/pam-kandidatsok-veileder').pop()}`
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
        tokenValidator,
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
