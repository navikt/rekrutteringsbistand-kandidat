const { client } = require('nightwatch-cucumber');
const { When } = require('cucumber');

When(/^jeg legger til utdanning "(.*)"/, (stilling) => {
    return 'pending';
});

When(/^jeg legger til fagfelt "(.*)"/, (stilling) => {
    return 'pending';
});
