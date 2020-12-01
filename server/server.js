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

const miljøvariablerFraVault = {
    ENHETSREGISTER_GATEWAY_APIKEY: process.env.PAM_KANDIDATSOK_VEILEDER_PROXY_API_APIKEY,
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.KANDIDAT_LOGIN_URL="${process.env.LOGINSERVICE_VEILEDER_URL}";\n` +
        `window.KANDIDAT_LAST_NED_CV_URL="${process.env.LAST_NED_CV_URL}";\n` +
        `window.KANDIDAT_ARBEIDSRETTET_OPPFOLGING_URL="${process.env.ARBEIDSRETTET_OPPFOLGING_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, 'build/static/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

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

const konfigurerProxyTilMidlertidigUtilgjengeligApi = () => {
    const [, , host, ...pathParts] = process.env.MIDLERTIDIG_UTILGJENGELIG_API.split('/');
    const path = pathParts.join('/');

    app.use(`${basePath}/midlertidig-utilgjengelig-api`, [
        fjernDobleCookies,
        proxy(host, {
            https: true,
            proxyReqPathResolver: (request) => {
                const nyPath = request.originalUrl.replace(
                    new RegExp(`${basePath}/midlertidig-utilgjengelig-api`),
                    path
                );

                console.log(
                    `~> Proxy midl.util. fra path '${request.originalUrl}' til URL '${host}/${nyPath}`
                );
                return nyPath;
            },
        }),
    ]);
};

const setupProxy = (fraPath, tilTarget, headers = undefined) =>
    createProxyMiddleware(fraPath, {
        target: tilTarget,
        changeOrigin: true,
        secure: true,
        headers: headers,
        pathRewrite: (path) => {
            const nyPath = path.replace(fraPath, '');
            console.warn(`~> Proxy fra '${path}' til '${tilTarget + nyPath}'`);

            return nyPath;
        },
    });

const startServer = () => {
    writeEnvironmentVariablesToFile();

    app.use(setupProxy(`${basePath}/kandidat-api`, process.env.KANDIDATSOK_API_URL));
    app.use(
        setupProxy(`${basePath}/enhetsregister-api`, process.env.ENHETSREGISTER_API, {
            'x-nav-apiKey': miljøvariablerFraVault.ENHETSREGISTER_GATEWAY_APIKEY,
        })
    );

    app.use(setupProxy(`${basePath}/sms-api`, process.env.SMS_API));
    app.use(`${basePath}/midlertidig-utilgjengelig-api`, [
        fjernDobleCookies,
        setupProxy(
            `${basePath}/midlertidig-utilgjengelig-api`,
            process.env.MIDLERTIDIG_UTILGJENGELIG_API
        ),
    ]);

    // konfigurerProxyTilMidlertidigUtilgjengeligApi();

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
