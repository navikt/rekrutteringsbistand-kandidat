import { antallTreff } from './fellesSteps';

const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/^jeg legger til arbeidserfaring "(.*)"/, (arbeidserfaring) => kandidatsokPage.leggTilArbeidserfaringkriterie(arbeidserfaring, antallTreff));

When(/^jeg legger til "(.*)" med arbeidserfaring/, (ar) => kandidatsokPage.leggTilArMedArbeidserfaringkriterie(ar, antallTreff));

Then(/ha arbeidserfaring som matcher "(.*)"/, (arbeidserfaring) => client.expect.element('.tbody').text.to.contain(arbeidserfaring));
