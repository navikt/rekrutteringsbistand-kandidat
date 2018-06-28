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

Then(/ha arbeidserfaring som matcher "(.*)"/, async (arbeidserfaring) => {
    const element = `//button[contains(@class, "kandidater--row")]//p[contains(@class, 'yrkeserfaring') and contains(text(), '${arbeidserfaring}')]`;
    await client.useXpath().expect.element(element).to.be.present;
    await client.useCss();
});

Then(/ha år med arbeidserfaring som matcher "(.*)"/, (ar) => {
    let element;
    if (ar === 'Under 1 år') element = '//button[contains(@class, "kandidater--row")]//p[@class="typo-normal inline" and text()="Under 1 år"]';
    else if (ar === '1-3 år') element = '//button[contains(@class, "kandidater--row")]//p[@class="typo-normal inline" and (text()="1 år" or text()="2 år" or text()="3 år")]';
    else if (ar === '4-9 år') element = '//button[contains(@class, "kandidater--row")]//p[@class="typo-normal inline" and (text()="4 år" or text()="5 år" or text()="6 år" or text()="7 år" or text()="8 år" or text()="9 år")]';
    else if (ar === 'Over 10 år') element = '//button[contains(@class, "kandidater--row")]//p[@class="typo-normal inline" and text()="Over 10 år"]';
    else throw `'${ar}' er ikke et støttet antall år med utdanning`;
    return client.elements('xpath', element, (result) => {
        kandidatsokPage.getText('@viserAntallTreff', (treff) => {
            kandidatsokPage.assert.equal(treff.value.split(' ')[1], result.value.length); // Sjekker at alle rader viser riktig antall år med erfaring.
        });
    });
});
