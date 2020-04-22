/* eslint-disable no-param-reassign, no-console */
const { isNullOrUndefined } = require('util');
const compression = require('compression');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const mustacheExpress = require('mustache-express');
const path = require('path');
const Promise = require('promise');
const proxy = require('express-http-proxy');
const useragent = require('useragent');

const isProd = process.env.NODE_ENV !== 'development';

const miljøvariablerTilFrontend = {
    LOGIN_URL: process.env.LOGINSERVICE_VEILEDER_URL,
    LOGOUT_URL: process.env.LOGINSERVICE_LOGOUT_VEILEDER_URL,
    LAST_NED_CV_URL: process.env.LAST_NED_CV_URL,
    ARBEIDSRETTET_OPPFOLGING_URL: process.env.ARBEIDSRETTET_OPPFOLGING_URL,
};

const miljøvariablerTilNode = {
    SMS_API: process.env.SMS_API,
    API_GATEWAY: process.env.PAM_SEARCH_API_RESTSERVICE_URL,
    PROXY_API_KEY: process.env.PAM_KANDIDATSOK_VEILEDER_PROXY_API_APIKEY,
    MIDLERTIDIG_UTILGJENGELIG_API: process.env.MIDLERTIDIG_UTILGJENGELIG_API,
};

const frontendProxyUrls = {
    PAM_KANDIDATSOK: '/kandidater/rest',
    PAM_SEARCH: '/kandidater/rest/veileder/kandidatsok/',
    PAM_SEARCH_API_GATEWAY: '/kandidater/api/search/enhetsregister',
    SMS: '/kandidater/api/sms',
    MIDLERTIDIG_UTILGJENGELIG: '/kandidater/midlertidig-utilgjengelig',
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_KANDIDATSOK_API_URL__="${frontendProxyUrls.PAM_KANDIDATSOK}";\n` +
        `window.__PAM_SEARCH_API__="${frontendProxyUrls.PAM_SEARCH}";\n` +
        `window.__PAM_SEARCH_API_GATEWAY_URL__="${frontendProxyUrls.PAM_SEARCH_API_GATEWAY}";\n` +
        `window.__SMS_PROXY__="${frontendProxyUrls.SMS}";\n` +
        `window.__MIDLERTIDIG_UTILGJENGELIG_PROXY__="${frontendProxyUrls.MIDLERTIDIG_UTILGJENGELIG}";\n` +
        `window.__LOGIN_URL__="${miljøvariablerTilFrontend.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${miljøvariablerTilFrontend.LOGOUT_URL}";\n` +
        `window.__LAST_NED_CV_URL__="${miljøvariablerTilFrontend.LAST_NED_CV_URL}";\n` +
        `window.__ARBEIDSRETTET_OPPFOLGING_URL__="${miljøvariablerTilFrontend.ARBEIDSRETTET_OPPFOLGING_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

const backendHost = () => {
    if (miljøvariablerTilNode.API_GATEWAY) {
        const hostAndPath = miljøvariablerTilNode.API_GATEWAY.split('://').pop();
        if (!hostAndPath) {
            throw Error(
                `Error: Kunne ikke hente host fra miljøvariabler (${miljøvariablerTilNode.API_GATEWAY})`
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
    if (miljøvariablerTilNode.API_GATEWAY) {
        const pathUnchecked = miljøvariablerTilNode.API_GATEWAY.split(backendHost()).pop();
        const pathFinal = pathUnchecked.replace(/\//g, ''); // replace all / with ''
        return pathFinal;
    }
    throw new Error('Error: error getting gateway prefix');
};

// proxy til backend
console.log(`proxy host: ${backendHost()}`);
console.log(`proxy prefix: ${gatewayPrefix()}`);

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
        const token = cookie
            .split(';')
            .filter((s) => s && s.indexOf('-idtoken') !== -1)
            .pop();
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
        const redirectUrl = `${
            miljøvariablerTilFrontend.LOGIN_URL
        }?redirect=${protocol}://${req.get('host')}/kandidater`;
        return res.redirect(redirectUrl);
    }
    return next();
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

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

const konfigurerProxyTilPamKandidatsøkApi = () => {
    server.use(
        '/kandidater/rest/',
        proxy('http://pam-kandidatsok-api', {
            proxyReqPathResolver: (req) =>
                req.originalUrl.replace(new RegExp('kandidater'), 'pam-kandidatsok-api'),
        })
    );
};

const konfigurerProxyTilEnhetsregister = () => {
    server.use(
        '/kandidater/api/search/enhetsregister/',
        proxy(backendHost(), {
            https: true,
            proxyReqOptDecorator: (proxyReqOpts, srcReq) => ({
                ...proxyReqOpts,
                cookie: srcReq.headers.cookie,
                headers: {
                    ...proxyReqOpts.headers,
                    'x-nav-apiKey': miljøvariablerTilNode.PROXY_API_KEY,
                },
            }),
            proxyReqPathResolver: (req) => {
                const convertedPath = `/${gatewayPrefix()}/${req.originalUrl
                    .split('/search/enhetsregister/')
                    .pop()}`;
                console.log(convertedPath);
                return convertedPath;
            },
        })
    );
};

const konfigurerProxyTilSmsApi = () => {
    const [, , host, path] = miljøvariablerTilNode.SMS_API.split('/');

    server.use(
        frontendProxyUrls.SMS,
        proxy(host, {
            https: true,
            proxyReqPathResolver: (request) =>
                request.originalUrl.replace(new RegExp('kandidater/api'), path),
        })
    );
};

const konfigurerProxyTilMidlertidigUtilgjengeligApi = () => {
    const [, , host, ...pathParts] = miljøvariablerTilNode.MIDLERTIDIG_UTILGJENGELIG_API.split('/');
    const path = pathParts.join('/');

    server.use(
        frontendProxyUrls.MIDLERTIDIG_UTILGJENGELIG,
        proxy(host, {
            https: true,
            proxyReqPathResolver: (request) =>
                request.originalUrl.replace(
                    new RegExp('kandidater/midlertidig-utilgjengelig'),
                    path
                ),
        })
    );
};

// Konfigurer server
const server = express();
server.use(compression(), browserRegistrator);

const port = process.env.PORT || 8080;
server.set('port', port);

server.disable('x-powered-by');
server.use(helmet());
server.set('views', `${__dirname}/views`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const renderSøk = () =>
    new Promise((resolve, reject) => {
        server.render('index.html', miljøvariablerTilFrontend, (err, html) => {
            if (err) {
                reject(err);
            } else {
                resolve(html);
            }
        });
    });

const startServer = (html) => {
    writeEnvironmentVariablesToFile();

    server.get('/rekrutteringsbistand-kandidat/internal/isAlive', (req, res) =>
        res.sendStatus(200)
    );
    server.get('/rekrutteringsbistand-kandidat/internal/isReady', (req, res) =>
        res.sendStatus(200)
    );

    konfigurerProxyTilPamKandidatsøkApi();

    server.use('/kandidater/js', express.static(path.resolve(__dirname, 'dist/js')));
    server.use('/kandidater/css', express.static(path.resolve(__dirname, 'dist/css')));

    konfigurerProxyTilEnhetsregister();
    konfigurerProxyTilSmsApi();
    konfigurerProxyTilMidlertidigUtilgjengeligApi();

    server.get(['/kandidater', '/kandidater/*'], tokenValidator, (req, res) => {
        res.send(html);
    });

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
        console.log(`Versjon: ${process.env.APP_VERSION}`);
    });
};

renderSøk().then(startServer, (error) => logError('Failed to render app', error));
