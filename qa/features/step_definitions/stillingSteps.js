const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

When(/^jeg legger til stillingen "(.*)"/, (stilling) => {
    return 'pending';
});

Then(/^skal stillingen "(.*)" vises/, (stilling) => {
    return 'pending';
});

Then(/^det skal være mulig å fjerne stillingen "(.*)"/, (stilling) => {
    return 'pending';
});
