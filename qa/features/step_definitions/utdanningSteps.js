import { antallTreff } from './fellesSteps';

const { client } = require('nightwatch-cucumber');
const { When } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/^jeg legger til utdanning "(.*)"/, (utdanning) => {
    return kandidatsokPage.leggTilUtdanningkriterie(utdanning, antallTreff);
});

When(/^jeg legger til fagfelt "(.*)"/, (fagfelt) => {
    return kandidatsokPage.leggTilFagfeltkriterie(fagfelt, antallTreff);
});
