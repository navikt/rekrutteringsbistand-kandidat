/* eslint-disable */
const { client } = require('nightwatch-cucumber');
const { Before, Given, When, Then, After } = require('cucumber');

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
    await client.loggInn(brukernavn);
    await kandidatsokPage.finnAntallKandidater(antallTreff);
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

After(async (scenarioContext) => {
    await client.sauceEnd(scenarioContext);
});
