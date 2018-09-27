/* eslint-disable */
const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();
const profilPage = client.page.KandidatprofilPage();

When(/^jeg åpner profilen til den første kandidaten/, async () => {
    await kandidatsokPage.click('@forsteRadKandidaterTabell');
    await profilPage.waitForElementVisible('@jobbprofilPanel', 30000);
});

Then(/^skal profilen vise kontaktinfo, jobbprofil og CV/, async () => {
    const nonEmptyStringRegex = /^(?!\s*$).+/;

    await profilPage.expect.element('@personaliaBakgrunn').text.to.match(nonEmptyStringRegex);
    await profilPage.expect.element('@jobbprofilPanel').text.to.match(nonEmptyStringRegex);
    await profilPage.expect.element('@cvPanel').text.to.match(nonEmptyStringRegex);
});
