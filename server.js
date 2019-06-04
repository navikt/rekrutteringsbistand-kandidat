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
        console.log(JSON.stringify({
            browserFamily: browserInfo.family,
            browserVersionMajor: browserInfo.major,
            browserVersionMinor: browserInfo.minor,
            browserVersionPatch: browserInfo.patch,
            url: req.url,
            method: req.method,
            navCallId: req.headers['Nav-CallId'] || req.headers['nav-callid'] || undefined
        }));
    } catch (e) {
        console.log(e);
    }
    return next();
};

const server = express();
server.use(compression(), browserRegistrator);
const port = process.env.PORT || 8080;

const APPS = {
    KANDIDATSOK: 'kandidatsok',
    KANDIDATSOK_NEXT: 'kandidatsok-next'
};

const appInfo = (appnavn) => {
    if (appnavn === APPS.KANDIDATSOK) {
        return {
            contextRoot: 'kandidater',
            appNavn: 'pam-kandidatsok',
            htmlFil: 'index.html'
        };
    } else if (appnavn === APPS.KANDIDATSOK_NEXT) {
        return {
            contextRoot: 'kandidater-next',
            appNavn: 'pam-kandidatsok-next',
            htmlFil: 'index-next.html'
        };
    }
    throw new Error('server.js krever en miljøvariabel med navn APP_NAME som matcher en av disse: ' +
        `${Object
            .values(APPS)
            .map((app) => (
                `"${app}"`
            ))
            .join(', ')}`);
};

const app = appInfo(process.env.APP_NAME);
const isProd = process.env.NODE_ENV !== 'development';

server.set('port', port);

server.disable('x-powered-by');
server.use(helmet({ xssFilter: false }));


if (isProd) {
    server.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            scriptSrc: [
                "'self'",
                'https://www.google-analytics.com',
                "'sha256-3ivVSOxwW5BHJHQdTkksJZIVc1FWOa3/VmxIvm60o2Y='" // sha'en er for at frontend-loggeren skal kunne kjøre som inline-script
            ],
            styleSrc: ["'self'"],
            fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
            connectSrc: ["'self'", 'https://www.google-analytics.com']
        }
    }));
}

const dirExists = (dir) => fs.existsSync(path.join(__dirname, dir));

const getViewsDir = () => {
    if (process.env.NODE_ENV === 'development' && dirExists('viewsDev')) {
        return 'viewsDev';
    }
    return 'views';
};

server.set('views', `${currentDirectory}/${getViewsDir()}`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const fasitProperties = {
    PAM_KANDIDATSOK_API_URL: `/${app.contextRoot}/rest/`,
    LOGIN_URL: process.env.LOGINSERVICE_URL,
    LOGOUT_URL: process.env.LOGOUTSERVICE_URL,
    PAMPORTAL_URL: process.env.PAMPORTAL_URL,
    API_GATEWAY: process.env.PAM_KANDIDATSOK_API_URL,
    PROXY_API_KEY: process.env.PAM_KANDIDATSOK_API_PROXY_API_APIKEY,
    USE_JANZZ: process.env.PAM_KANDIDATSOK_USE_JANZZ === 'true',
    ONTOLOGY_SEARCH_API_URL: `/${app.contextRoot}/ontologi`
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_KANDIDATSOK_API_URL__="${fasitProperties.PAM_KANDIDATSOK_API_URL}";\n` +
        `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n` +
        `window.__PAMPORTAL_URL__="${fasitProperties.PAMPORTAL_URL}";\n` +
        `window.__USE_JANZZ__="${fasitProperties.USE_JANZZ}";\n` +
        `window.__CONTEXT_ROOT__="${app.contextRoot}";\n` +
        `window.__ONTOLOGY_SEARCH_API_URL__="${fasitProperties.ONTOLOGY_SEARCH_API_URL}";\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};

const renderSok = () => (
    new Promise((resolve, reject) => {
        server.render(
            app.htmlFil,
            { APP_VERSION: process.env.APP_VERSION },
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
        const redirectUrl = `${fasitProperties.LOGIN_URL}&redirect=${protocol}://${req.get('host')}/${app.contextRoot}`;
        return res.redirect(redirectUrl);
    }
    return next();
};

const urlHost = (miljo) => {
    if (miljo.toUpperCase() === 'Q0') {
        return 'https://arbeidsplassen-q.nav.no';
    } else if (miljo.toUpperCase() === 'Q6') {
        return 'https://arbeidsplassen-t.nav.no';
    }
    return 'https://arbeidsplassen.nav.no';
};

const startServer = (html) => {
    writeEnvironmentVariablesToFile();

    server.get(`/${app.appNavn}/internal/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`/${app.appNavn}/internal/isReady`, (req, res) => res.sendStatus(200));

    const proxyHost = fasitProperties.API_GATEWAY.split('://').pop().split('/')[0];

    server.use(`/${app.contextRoot}/rest/`, proxy(proxyHost, {
        https: true,
        proxyReqPathResolver: (req) => (
            req.originalUrl.replace(new RegExp(app.contextRoot), 'pam-kandidatsok-api/pam-kandidatsok-api')
        ),
        proxyReqOptDecorator: (proxyReqOpts) => {
            proxyReqOpts.headers['x-nav-apiKey'] = fasitProperties.PROXY_API_KEY;
            return proxyReqOpts;
        }
    }));

    server.use(`/${app.contextRoot}/ontologi/`, proxy('http://pam-search-api.default', {
        proxyReqPathResolver: (req) => {
            const newUrl = req.originalUrl.replace(new RegExp(`${app.contextRoot}/ontologi`), 'ontologi')
            console.log({newUrl});
            return newUrl;
        }
    }));

    server.use(
        `/${app.contextRoot}/js`,
        express.static(path.resolve(__dirname, 'dist/js'))
    );
    server.use(
        `/${app.contextRoot}/css`,
        express.static(path.resolve(__dirname, 'dist/css'))
    );

    server.get(
        [`/${app.contextRoot}`, `/${app.contextRoot}/*`],
        tokenValidator,
        (req, res) => {
            res.send(html);
        }
    );

    server.get(
        ['/pam-kandidatsok', '/pam-kandidatsok/*'],
        (req, res) => {
            const host = urlHost(process.env.FASIT_ENVIRONMENT_NAME);
            const urlPath = req.url.replace(new RegExp('pam-kandidatsok'), 'kandidater');
            res.redirect(`${host}${urlPath}`);
        }
    );

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/ contextRoot:${app.contextRoot}`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderSok()
    .then(startServer)
    .catch((error) => logError('Failed to render app', error));
