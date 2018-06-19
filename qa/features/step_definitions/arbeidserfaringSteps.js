const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

When(/^jeg legger til arbeidserfaring "(.*)"/, (arbeidserfaring) => {
    return 'pending';
});

When(/^jeg legger til "(.*)" med arbeidserfaring/, (ar) => {
    return 'pending';
});

Then(/^kandidatene skal ha arbeidserfaring som matcher "(.*)"/, (ar) => {
    return 'pending';
});
