import { antallTreff } from './fellesSteps';

const { client } = require('nightwatch-cucumber');
const { When } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/jeg legger til kompetanse "(.*)"/, (kompetanse) => {
    return kandidatsokPage.leggTilKompetansekriterie(kompetanse, antallTreff);
});
