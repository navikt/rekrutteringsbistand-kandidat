/* eslint-disable */
module.exports = {
    elements: {
        kandidatlisterLink: 'a[href="/kandidater/lister"]',
        opprettNyListeKnapp: '#opprett-ny-liste',
        forsteListe: '.Kandidatliste__panel',
        listeNavnInput: '#kandidatliste-navn-input',
        listeBeskrivelseInput: '#kandidatliste-beskrivelse-input',
        listeOppdragsgiverInput: '#kandidatliste-oppdragsgiver-input',
        listeOpprettKnapp: '#kandidatliste-opprett-knapp',
        slettKnapp: '.knapp--hoved',
        listeLagretMelding: '#kandidatliste-lagret-melding',
        listeSlettetMelding: '#kandidatliste-slettet-melding'
    },

    commands: [{
        navigerTilKandidatlister() {
            return this
                .clickElement('@kandidatlisterLink', this, 1000)
                .waitForElementVisible('@opprettNyListeKnapp');
        },

        opprettNyListe(navn, beskrivelse='', oppdragsgiver='') {
            return this
                .waitForElementVisible('@opprettNyListeKnapp')
                .click('@opprettNyListeKnapp')
                .waitForElementVisible('@listeNavnInput')
                .setValue('@listeNavnInput', navn)
                .setValue('@listeBeskrivelseInput', beskrivelse)
                .setValue('@listeOppdragsgiverInput', oppdragsgiver)
                .click('@listeOpprettKnapp');
        },

        slettKandidatlister(navn) {
            let self = this;

            return this
                .waitForElementVisible('@forsteListe')
                .api.useXpath()
                .elements('xpath', `//h2[text()="${navn}"]`, (result) => {
                    const antallLister = result.value.length;
                    for (let i = 0; i < antallLister; i++) {
                        self
                            .clickElement(`//h2[text()="${navn}"]/../../../../..//*[@class="Delete__icon"]`, self, 1000)
                            .waitForElementVisible('@slettKnapp')
                            .clickElement('@slettKnapp', self, 1000)
                            .waitForElementVisible('@listeSlettetMelding')
                            .pagePause(1000);
                    }
                })
                .useCss()
                .page.KandidatlisterPage();
        }
    }]
};
