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
        deleteKnappModal: '.knapp--hoved',
        hjelpetekstfading: '.alertstripe__tekst'
    },

    commands: [{
        slettKandidatFraListe() {
            return this
                .waitForElementPresent('@kandidatCheckbox')
                .setValue('@kandidatCheckbox', this.api.Keys.SPACE)
                .click('@deleteIcon')
                .click('@deleteKnappModal')
                .waitForElementVisible('@hjelpetekstfading')
                .waitForElementNotVisible('@hjelpetekstfading')
                .pagePause(500);
        }
    }]
};
