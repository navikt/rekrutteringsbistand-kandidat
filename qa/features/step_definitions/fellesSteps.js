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
});

Given(/^at jeg er logget inn i kandidatsøket som "(.*)"/, async (brukernavn) => {
    await client.url(client.launch_url);
    await idPortenPage.loggInn(brukernavn);
    await kandidatsokPage
        .waitForElementPresent('@sideInnhold', 20000)
        .finnAntallKandidater(antallTreff);
});

When(/^jeg trykker Se kandidatene/, () => {
    return kandidatsokPage.seKandidatene();
});

Then(/^skal det vises treff på kandidater som matcher "(.*)"/, (kriterie) => {
    return kandidatsokPage.skalVisesTreffSomMatcher(kriterie);
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
