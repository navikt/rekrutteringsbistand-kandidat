import { antallTreff } from './fellesSteps';

const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/^jeg legger til arbeidserfaring "(.*)"/, (arbeidserfaring) => {
    return kandidatsokPage.leggTilArbeidserfaringkriterie(arbeidserfaring, antallTreff);
});

When(/^jeg legger til "(.*)" med arbeidserfaring/, (ar) => {
    return kandidatsokPage.leggTilArMedArbeidserfaringkriterie(ar, antallTreff);
});

Then(/^kandidatene skal ha arbeidserfaring som matcher "(.*)"/, (ar) => {
    return kandidatsokPage.skalVisesTreffSomMatcherAr(ar);
});
