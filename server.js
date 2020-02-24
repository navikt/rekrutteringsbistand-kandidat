/* eslint-disable no-param-reassign, no-console */
const express = require('express');
const compression = require('compression');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const fs = require('fs');
const Promise = require('promise');
const { isNullOrUndefined } = require('util');
const jwt = require('jsonwebtoken');
const useragent = require('useragent');

const currentDirectory = __dirname;

const browserRegistrator = (req, res, next) => {
    try {
        const browserInfo = useragent.lookup(req.headers['user-agent']);
        console.log(
            JSON.stringify({
                browserFamily: browserInfo.family,
                browserVersionMajor: browserInfo.major,
                browserVersionMinor: browserInfo.minor,
                browserVersionPatch: browserInfo.patch,
                url: req.url,
                method: req.method,
                navCallId: req.headers['Nav-CallId'] || req.headers['nav-callid'] || undefined,
            })
        );
    } catch (e) {
        console.log(e);
    }
    return next();
};

const server = express();
server.use(compression(), browserRegistrator);
const port = process.env.PORT || 8080;
server.set('port', port);

server.disable('x-powered-by');
// TODO: slå på helmet igjen
// server.use(helmet({ xssFilter: false }));

// server.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'none'"],
//             scriptSrc: [
//                 "'self'",
//                 'https://www.google-analytics.com',
//                 "'sha256-3ivVSOxwW5BHJHQdTkksJZIVc1FWOa3/VmxIvm60o2Y='", // sha'en er for at frontend-loggeren skal kunne kjøre som inline-script
//             ],
//             styleSrc: ["'self'"],
//             fontSrc: ["'self'", 'data:'],
//             imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
//             connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://sentry.gc.nav.no'],
//         },
//     })
// );

server.set('views', `${currentDirectory}/views`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const isProd = process.env.NODE_ENV !== 'development';

const fasitProperties = {
    PAM_KANDIDATSOK_API_URL: '/kandidater/rest',
    PAM_SEARCH_API: '/kandidater/rest/veileder/kandidatsok/',
    PAM_SEARCH_API_GATEWAY_URL: '/kandidater/api/search/enhetsregister',
    LOGIN_URL: process.env.LOGINSERVICE_VEILEDER_URL,
    LOGOUT_URL: process.env.LOGINSERVICE_LOGOUT_VEILEDER_URL,
    API_GATEWAY: process.env.PAM_SEARCH_API_RESTSERVICE_URL,
    PROXY_API_KEY: process.env.PAM_KANDIDATSOK_VEILEDER_PROXY_API_APIKEY,
    LAST_NED_CV_URL: process.env.LAST_NED_CV_URL,
    ARBEIDSRETTET_OPPFOLGING_URL: process.env.ARBEIDSRETTET_OPPFOLGING_URL,
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_KANDIDATSOK_API_URL__="${fasitProperties.PAM_KANDIDATSOK_API_URL}";\n` +
        `window.__PAM_SEARCH_API__="${fasitProperties.PAM_SEARCH_API}";\n` +
        `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n` +
        `window.__PAM_SEARCH_API_GATEWAY_URL__="${fasitProperties.PAM_SEARCH_API_GATEWAY_URL}";\n` +
        `window.__ARBEIDSRETTET_OPPFOLGING_URL__="${fasitProperties.ARBEIDSRETTET_OPPFOLGING_URL}";\n` +
        `window.__LAST_NED_CV_URL__="${fasitProperties.LAST_NED_CV_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, err => {
        if (err) throw err;
    });
};

const backendHost = () => {
    if (fasitProperties.API_GATEWAY) {
        const hostAndPath = fasitProperties.API_GATEWAY.split('://').pop();
        if (!hostAndPath) {
            throw Error(
                `Error: Kunne ikke hente host fra fasitProperties.API_GATEWAY (${fasitProperties.API_GATEWAY})`
            );
        }
        const host = hostAndPath.split('/').shift();
        if (!host) {
            throw Error('Error: Kunne ikke hente host fra path');
        }
        return host;
    }
    throw Error('Error: process.env.PAM_SEARCH_API_RESTSERVICE_URL mangler');
};

const gatewayPrefix = () => {
    if (fasitProperties.API_GATEWAY) {
        const pathUnchecked = fasitProperties.API_GATEWAY.split(backendHost()).pop();
        const pathFinal = pathUnchecked.replace(/\//g, ''); // replace all / with ''
        return pathFinal;
    }
    throw new Error('Error: error getting gateway prefix');
};

// proxy til backend
console.log(`proxy host: ${backendHost()}`);
console.log(`proxy prefix: ${gatewayPrefix()}`);

const normalizedTokenExpiration = token => {
    const expiration = jwt.decode(token).exp;
    if (expiration.toString().length === 10) {
        return expiration * 1000;
    }
    return expiration;
};

const unsafeTokenIsExpired = token => {
    if (token) {
        const normalizedExpirationTime = normalizedTokenExpiration(token);
        return normalizedExpirationTime - Date.now() < 0;
    }
    return true;
};

const extractTokenFromCookie = cookie => {
    if (cookie !== undefined) {
        const token = cookie
            .split(';')
            .filter(s => s && s.indexOf('-idtoken') !== -1)
            .pop();
        if (token) {
            return token
                .split('=')
                .pop()
                .trim();
        }
    }
    return null;
};

const tokenValidator = (req, res, next) => {
    const token = extractTokenFromCookie(req.headers.cookie);
    if (isNullOrUndefined(token) || unsafeTokenIsExpired(token)) {
        const protocol = isProd ? 'https' : req.protocol; // produksjon får også inn http, så må tvinge https der
        const redirectUrl = `${fasitProperties.LOGIN_URL}?redirect=${protocol}://${req.get(
            'host'
        )}/kandidater`;
        return res.redirect(redirectUrl);
    }
    return next();
};

const renderSok = () =>
    new Promise((resolve, reject) => {
        server.render('index.html', fasitProperties, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

const startServer = html => {
    writeEnvironmentVariablesToFile();

    server.get('/rekrutteringsbistand-kandidat/internal/isAlive', (req, res) =>
        res.sendStatus(200)
    );
    server.get('/rekrutteringsbistand-kandidat/internal/isReady', (req, res) =>
        res.sendStatus(200)
    );

    server.use(
        '/kandidater/rest/',
        proxy('http://pam-kandidatsok-api', {
            proxyReqPathResolver: req =>
                req.originalUrl.replace(new RegExp('kandidater'), 'pam-kandidatsok-api'),
        })
    );

    server.use('/kandidater/js', express.static(path.resolve(__dirname, 'dist/js')));
    server.use('/kandidater/css', express.static(path.resolve(__dirname, 'dist/css')));

    server.use(
        '/kandidater/api/search/enhetsregister/',
        proxy(backendHost(), {
            https: true,
            proxyReqOptDecorator: (proxyReqOpts, srcReq) => ({
                ...proxyReqOpts,
                cookie: srcReq.headers.cookie,
                headers: {
                    ...proxyReqOpts.headers,
                    'x-nav-apiKey': fasitProperties.PROXY_API_KEY,
                },
            }),
            proxyReqPathResolver: req => {
                const convertedPath = `/${gatewayPrefix()}/${req.originalUrl
                    .split('/search/enhetsregister/')
                    .pop()}`;
                console.log(convertedPath);
                return convertedPath;
            },
        })
    );

    server.get(['/kandidater', '/kandidater/*'], tokenValidator, (req, res) => {
        res.send(html);
    });

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
        console.log(`Versjon: ${process.env.APP_VERSION}`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderSok().then(startServer, error => logError('Failed to render app', error));
