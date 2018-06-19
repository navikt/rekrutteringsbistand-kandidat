const { client } = require('nightwatch-cucumber');
const { When } = require('cucumber');

When(/jeg legger til sted "(.*)"/, (sted) => {
    return 'pending';
});
