/* eslint-disable */
const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/^jeg åpner CVen til den første kandidaten/, () => {
    return kandidatsokPage.click('@forsteRadKandidaterTabell');
});

Then(/^skal hele CVen vises/, async () => {
    const nonEmptyStringRegex = /^(?!\s*$).+/;

    await kandidatsokPage.expect.element('@cvModal').to.be.present.before(30000);
    await kandidatsokPage.expect.element('@cvModal').text.to.match(nonEmptyStringRegex);
});