const { client } = require('nightwatch-cucumber');
const { When, Then } = require('cucumber');

const listerPage = client.page.KandidatlisterPage();
const listePage = client.page.KandidatlistePage();

When(/jeg går til siden for kandidatlister/, () => (listerPage.navigerTilKandidatlister()));

When(/jeg oppretter en kandidatliste/, (listeInput) => {
    const navn = listeInput.hashes()[0].Navn ? listeInput.hashes()[0].Navn : '';
    const beskrivelse = listeInput.hashes()[0].Beskrivelse ? listeInput.hashes()[0].Beskrivelse : '';
    const oppdragsgiver = listeInput.hashes()[0].Oppdragsgiver ? listeInput.hashes()[0].Oppdragsgiver : '';

    return listerPage.opprettNyListe(navn, beskrivelse, oppdragsgiver);
});

When(/jeg åpner kandidatlisten "(.*)"/, async (listeNavn) => {
    await listerPage.waitForElementVisible('@forsteListe');
    await client.useXpath().click(`//h2[text()="${listeNavn}"]`).useCss();
    await listePage.waitForElementVisible('@kandidatlisteDetaljer');
});

Then(/skal navn på listen være "(.*)"/, (navn) => listePage.assert.containsText('@listeNavn', navn));

Then(/beskrivelse av listen være "(.*)"/, (beskrivelse) => listePage.assert.containsText('@listeBeskrivelse', beskrivelse));

Then(/oppdragsgiver for listen være "(.*)"/, (oppdragsgiver) => listePage.assert.containsText('@listeOppdragsgiver', oppdragsgiver));

When(/jeg sletter alle kandidatlister med navn "(.*)"/, (listeNavn) => listerPage.slettKandidatlister(listeNavn));

Then(/skal det ikke lenger eksistere kandidatlister med navn "(.*)"/, async (listeNavn) => {
    await client.useXpath().expect.element(`//h2[text()="${listeNavn}"]`).to.not.be.present;
    await client.useCss();
});
