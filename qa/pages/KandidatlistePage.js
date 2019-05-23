/* eslint-disable */
module.exports = {
    elements: {
        kandidatlisteDetaljer: '.KandidatlisteDetalj__header',
        listeNavn: '#kandidatliste-navn',
        listeBeskrivelse: '#kandidatliste-beskrivelse',
        listeOppdragsgiver: '#kandidatliste-oppdragsgiver',
        antallKandidater: '#kandidatliste-antall-kandidater',
        kandidatCheckbox: '.KandidatlisteDetalj__panel > div > div > input[id^=marker-kandidat-checkbox-]', // Første kandidat som ikke er inaktiv
        alleKandidaterCheckbox: '#marker-alle-kandidater-checkbox',
        deleteIcon: '.Delete__icon',
        deleteKnappModal: '.Knapp--hoved',
        hjelpetekstfading: '.alertstripe__tekst'
    },

    commands: [{
        slettKandidatFraListe() {
            return this
                .waitForElementPresent('@kandidatCheckbox')
                .setValue('@kandidatCheckbox', this.api.Keys.SPACE)
                .api.execute('scrollTo(0,0);').page.KandidatlistePage()
                .click('@deleteIcon')
                .click('@deleteKnappModal')
                .waitForElementVisible('@hjelpetekstfading')
                .waitForElementNotVisible('@hjelpetekstfading', 7000)
                .pagePause(500);
        }
    }]
};
