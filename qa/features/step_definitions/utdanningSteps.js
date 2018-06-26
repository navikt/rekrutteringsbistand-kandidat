import { antallTreff } from './fellesSteps';

const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/^jeg legger til utdanning "(.*)"/, (utdanning) => {
    return kandidatsokPage.leggTilUtdanningkriterie(utdanning, antallTreff);
});

When(/^jeg legger til fagfelt "(.*)"/, (fagfelt) => {
    return kandidatsokPage.leggTilFagfeltkriterie(fagfelt, antallTreff);
});

Then(/ha utdanning med fagfelt som matcher "(.*)"/, (fagfelt) => {
    const element = `//button[contains(@class, "kandidater--row")]//p[contains(@class, 'utdanning') and contains(text(), '${fagfelt.toLowerCase()}')]`;
    return client.useXpath().expect.element(element).to.be.present;
});
