/* eslint-disable */
exports.command = function (scenarioContext) {
    const client = this;
    const SauceLabs = require('saucelabs');
    const saucelabs = new SauceLabs({
        username: process.env.SAUCE_USERNAME,
        password: process.env.SAUCE_ACCESS_KEY,
        proxy: process.env.BUILD_TAG ? 'http://webproxy-internett.nav.no:8088' : ''
    });

    saucelabs.updateJob(
        client.capabilities['webdriver.remote.sessionid'],
        {
            passed: scenarioContext.result.status === 'passed',
            name: `${scenarioContext.pickle.name}`,
            build: process.env.BUILD_TAG ? process.env.BUILD_TAG : ''
        },
        () => {
            client.end();
        }
    );
};
