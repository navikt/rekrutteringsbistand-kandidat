const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    const setupProxy = (fraPath, tilTarget) => {
        app.use(
            fraPath,
            createProxyMiddleware({
                target: tilTarget,
                changeOrigin: true,
                pathRewrite: (path) => {
                    const nyPath = path.replace(fraPath, '');
                    console.log(`Proxy fra '${path}' til '${tilTarget + nyPath}'`);
                    return nyPath;
                },
            })
        );
    };

    setupProxy(
        '/rekrutteringsbistand-kandidat/kandidat-api',
        'http://localhost:8766/rekrutteringsbistand-kandidat-api/rest'
    );
};
