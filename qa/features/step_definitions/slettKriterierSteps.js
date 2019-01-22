/* eslint-disable */
import { antallTreff } from './fellesSteps';

const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/jeg trykker Slett alle kriterier/, () => {
    return kandidatsokPage.slettAlleKriterier(antallTreff);
});

Then(/skal antall treff være det samme som alle kandidater/, async () => {
    await kandidatsokPage.finnAntallKandidater(antallTreff);
    await client.assert.equal(
        antallTreff.siste >= antallTreff.forste-100 && antallTreff.siste <= antallTreff.forste+100, // Litt slingringsmonn i fall det totale antallet kandidater skulle endre seg i løpet av kjøringen
        true,
        `Antall treff sist, ${antallTreff.siste}, må være innenfor +-100 av antall treff først, ${antallTreff.forste}`
    );
});
