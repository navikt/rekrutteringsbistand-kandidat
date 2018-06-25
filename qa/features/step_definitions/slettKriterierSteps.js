import { antallTreff } from './fellesSteps';

const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/jeg trykker Slett alle kriterier/, () => {
    return kandidatsokPage.slettAlleKriterier();
});

Then(/skal antall treff være det samme som alle kandidater/, async () => {
    await kandidatsokPage.finnAntallKandidater(antallTreff);
    await client.assert.equal(antallTreff.forste === antallTreff.siste, true, `Antall treff først ${antallTreff.forste} = ${antallTreff.siste} antall treff sist`);
});
