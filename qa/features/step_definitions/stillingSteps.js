import { antallTreff } from './fellesSteps';

const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const kandidatsokPage = client.page.KandidatsokPage();

When(/^jeg legger til stillingen "(.*)"/, (stilling) => (
    kandidatsokPage.leggTilStillingkriterie(stilling, antallTreff)
));

Then(/^skal stillingen "(.*)" vises/, (stilling) => (
    client.expect.element(`button[value=${stilling}`).to.be.present.before(2000)
));

Then(/^det skal være mulig å fjerne stillingen "(.*)"/, (stilling) => (
    client
        .click('.Merkelapp')
        .useXpath()
        .expect.element(`//div[text()="${stilling}"]`).text.to.not.be.present.before(2000)
));
