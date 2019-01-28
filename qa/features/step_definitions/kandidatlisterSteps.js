const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const listerPage = client.page.KandidatlisterPage();
const listePage = client.page.KandidatlistePage();
const sokPage = client.page.KandidatsokPage();

const browserName = () => (`${client.options.desiredCapabilities.browserName}`);
const platform = () => (client.options.desiredCapabilities.platform);

When(/jeg går til siden for kandidatlister/, () => (listerPage.navigerTilKandidatlister()));

When(/jeg oppretter en kandidatliste/, (listeInput) => {
    const navn = listeInput.hashes()[0].Navn
        ? `${listeInput.hashes()[0].Navn} ${browserName()} ${platform()}`
        : `${browserName()} ${platform()}`;
    const beskrivelse = listeInput.hashes()[0].Beskrivelse ? listeInput.hashes()[0].Beskrivelse : '';
    const oppdragsgiver = listeInput.hashes()[0].Oppdragsgiver ? listeInput.hashes()[0].Oppdragsgiver : '';

    return listerPage.opprettNyListe(navn, beskrivelse, oppdragsgiver)
        .waitForElementVisible('@listeLagretMelding');
});

When(/jeg åpner kandidatlisten "(.*)"/, async (listeNavn) => {
    await listerPage.waitForElementVisible('@forsteListe', 20000);
    await listerPage.waitForElementNotVisible('@listeLagretMelding', 6000);
    await client.useXpath().clickElement(`//h2[text()="${listeNavn} ${browserName()} ${platform()}"]`, undefined, 500).useCss();
    await listePage.waitForElementVisible('@kandidatlisteDetaljer');
});

Then(/skal navn på listen være "(.*)"/, (navn) => listePage.assert.containsText('@listeNavn', `${navn} ${browserName()} ${platform()}`));

Then(/beskrivelse av listen være "(.*)"/, (beskrivelse) => listePage.assert.containsText('@listeBeskrivelse', beskrivelse));

Then(/oppdragsgiver for listen være "(.*)"/, (oppdragsgiver) => listePage.assert.containsText('@listeOppdragsgiver', oppdragsgiver));

When(/jeg sletter alle kandidatlister med navn "(.*)"/, (listeNavn) => listerPage.slettKandidatlister(`${listeNavn} ${browserName()} ${platform()}`));

Then(/skal det ikke lenger eksistere kandidatlister med navn "(.*)"/, async (listeNavn) => {
    await client.useXpath().expect.element(`//h2[text()="${listeNavn} ${browserName()} ${platform()}"]`).to.not.be.present;
    await client.useCss();
});

When(/jeg lagrer "(.*)" kandidater i kandidatlisten "(.*)"/, async (antallKandidater, listeNavn) => {
    await sokPage
        .setValue('@markerAlleKandidaterCheckbox', client.Keys.SPACE)
        .waitForElementVisible('@lagreKandidaterKnapp')
        .click('@lagreKandidaterKnapp');

    await listerPage.opprettNyListe(`${listeNavn} ${browserName()} ${platform()}`);

    await sokPage.waitForElementPresent('@forsteKandidatliste', 20000)
        .setValue(`input[aria-label="Marker liste ${listeNavn} ${browserName()} ${platform()}"]`, client.Keys.SPACE)
        .clickElement('@lagreKandidaterIListeKnapp', sokPage, 500)
        .waitForElementVisible('@hjelpetekstfading')
        .waitForElementNotVisible('@hjelpetekstfading', 10000)
        .pagePause(500);
});

Then(/skal listen inneholde "(.*)" kandidater/, async (antallKandidater) => {
    await listePage.waitForElementPresent('@antallKandidater')
        .expect.element('@antallKandidater').text.to.equal(`${antallKandidater} kandidater`);
});

When(/jeg sletter en kandidat fra listen/, async () => {
    await listePage
        .slettKandidatFraListe();
});
