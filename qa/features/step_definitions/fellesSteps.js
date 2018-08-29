/* eslint-disable */
const { client } = require('nightwatch-cucumber');
const { Before, Given, When, Then, After } = require('cucumber');

const idPortenPage = client.page.IdPortenPage();
const kandidatsokPage = client.page.KandidatsokPage();

export let antallTreff;

Before(() => {
    antallTreff = {
        alleTreff: [],
        forste: null,
        nestSiste: null,
        siste: null
    };
    return client.useCss(); // I tilfelle et scenario feiler med XPath, så vil neste scenario bruke CSS, som er default.
});

Given(/^at jeg er logget inn i kandidatsøket som "(.*)"/, async (brukernavn) => {
    await client.url(client.launch_url);
    await client.maximizeWindow();
    await idPortenPage.loggInn(brukernavn);
    await kandidatsokPage.waitForElementPresent('@sideInnhold', 30000);
    await client.url(client.launch_url + '/resultat');
    await kandidatsokPage
        .waitForElementPresent('@stillingPanel', 20000)
        .finnAntallKandidater(antallTreff);
});

When(/^jeg trykker Se kandidatene/, () => {
    return kandidatsokPage.seKandidatene();
});

Then(/skal antall treff øke|antall treff skal øke/, async () => {
    await kandidatsokPage.finnAntallKandidater(antallTreff);
    await client.assert.equal(antallTreff.nestSiste < antallTreff.siste, true, `Antall treff før ${antallTreff.nestSiste} < ${antallTreff.siste} antall treff etter`);
});

Then(/skal antall treff minke|antall treff skal minke/, async () => {
    await kandidatsokPage.finnAntallKandidater(antallTreff);
    await client.assert.equal(antallTreff.nestSiste > antallTreff.siste, true, `Antall treff før ${antallTreff.nestSiste} > ${antallTreff.siste} antall treff etter`);
});

After(() => {
    client.end();
});
