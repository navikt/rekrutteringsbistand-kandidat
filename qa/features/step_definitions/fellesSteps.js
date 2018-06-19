const { client } = require('nightwatch-cucumber');
const { Given, When, Then } = require('cucumber');

const idPortenPage = client.page.idPorten();
const kandidatsokPage = client.page.kandidatsok();

Given(/^at jeg er logget inn i kandidatsøket som "(.*)"/, async (brukernavn) => {
    await client.url('https://tjenester-t6.nav.no/pam-kandidatsok');
    await idPortenPage.loggInn(brukernavn);
    await kandidatsokPage.waitForElementPresent('@sideInnhold', 20000);
});

When(/^jeg trykker Se kandidatene/, () => {
    return 'pending';
});

Then(/^skal det vises treff på kandidater som matcher "(.*)"/, (stilling) => {
    return 'pending';
});

Then(/skal antall treff øke|antall treff skal øke/, () => {
    return 'pending';
});

Then(/skal antall treff minke|antall treff skal minke/, () => {
    return 'pending';
});
