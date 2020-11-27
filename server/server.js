/* eslint-disable no-param-reassign, no-console */
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = require('express-http-proxy');

const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;

const basePath = '/rekrutteringsbistand-kandidat';
const buildPath = path.join(__dirname, 'build');

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
        `window.KANDIDAT_PAM_SEARCH_API_GATEWAY_URL="${frontendProxyUrls.PAM_SEARCH_API_GATEWAY}";\n` +
        `window.KANDIDAT_SMS_PROXY="${frontendProxyUrls.SMS}";\n` +
        `window.KANDIDAT_MIDLERTIDIG_UTILGJENGELIG_PROXY="${frontendProxyUrls.MIDLERTIDIG_UTILGJENGELIG}";\n` +
        `window.KANDIDAT_LOGIN_URL="${miljøvariablerTilFrontend.LOGIN_URL}";\n` +
        `window.KANDIDAT_LAST_NED_CV_URL="${miljøvariablerTilFrontend.LAST_NED_CV_URL}";\n` +
        `window.KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL="${miljøvariablerTilFrontend.ARBEIDSRETTET_OPPFOLGING_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, 'build/static/js/env.js'), fileContent, (err) => {
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

const mapToCookies = (cookieString) =>
    cookieString
        .split(';')
        .filter((str) => !!str && str !== '')
        .map((cookieStr) => ({
            name: cookieStr.split('=')[0].trim(),
            value: cookieStr.split('=')[1].trim(),
        }));

const mapToCookieString = (cookieList) =>
    cookieList.map((cookie) => `${cookie.name}=${cookie.value}`).join(';');

const lagCookieStringUtenDobleCookies = (cookieString) => {
    const cookies = mapToCookies(cookieString);

    const cookiesUtenDuplikater = cookies.filter((cookie) => {
        const duplicates = cookies.filter((cookie2) => cookie2.name === cookie.name);
        if (duplicates.length === 1) {
            return true;
        }
        return cookie.value === duplicates[0].value;
    });

    const forskjellIAntallCookies = cookies.length - cookiesUtenDuplikater.length;
    if (forskjellIAntallCookies !== 0) {
        console.log('Fjernet ' + forskjellIAntallCookies + ' cookies');
    }

    return mapToCookieString(cookiesUtenDuplikater);
};

const fjernDobleCookies = (req, res, next) => {
    req.headers.cookie = lagCookieStringUtenDobleCookies(req.headers.cookie);
    next();
};

const konfigurerProxyTilEnhetsregister = () => {
    app.use(
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

    app.use(
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

    app.use(frontendProxyUrls.MIDLERTIDIG_UTILGJENGELIG, [
        fjernDobleCookies,
        proxy(host, {
            https: true,
            proxyReqPathResolver: (request) =>
                request.originalUrl.replace(
                    new RegExp('kandidater/midlertidig-utilgjengelig'),
                    path
                ),
        }),
    ]);
};

const setupProxy = (fraPath, tilTarget) =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        pathRewrite: (path) => {
            const nyPath = path.replace(fraPath, '');
            console.warn(`~> Proxy fra '${path}' til '${tilTarget + nyPath}'`);

            return nyPath;
        },
    });

const startServer = () => {
    writeEnvironmentVariablesToFile();

    app.use(setupProxy(`${basePath}/kandidat-api`, process.env.KANDIDATSOK_API_URL));

    konfigurerProxyTilEnhetsregister();
    konfigurerProxyTilSmsApi();
    konfigurerProxyTilMidlertidigUtilgjengeligApi();

    app.use(`${basePath}/static`, express.static(buildPath + '/static'));
    app.use(`${basePath}/asset-manifest.json`, express.static(`${buildPath}/asset-manifest.json`));

    app.get([`${basePath}/internal/isAlive`, `${basePath}/internal/isReady`], (req, res) =>
        res.sendStatus(200)
    );

    app.listen(port, () => {
        console.log('Server kjører på port', port);
    });
};

startServer();
