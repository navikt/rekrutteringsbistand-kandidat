module.exports = {
    elements: {
        sideInnhold: '.search-page',
        antallKandidaterTreff: '#antall-kandidater-treff',
        seKandidateneKnapp: '#se-kandidatene-knapp',
        leggTilStillingKnapp: '#leggtil-stilling-knapp',
        leggTilStillingInput: '#typeahead-stilling',
        leggTilFagfeltKnapp: '#leggtil-fagfelt-knapp',
        leggTilFagfeltInput: '#yrke',
        leggTilUtdanningIngen: '#utdanningsniva-ingen-checkbox',
        leggTilUtdanningVideregaende: '#utdanningsniva-videregaende-checkbox',
        leggTilUtdanningFagskole: '#utdanningsniva-fagskole-checkbox',
        leggTilUtdanningBachelorgrad: '#utdanningsniva-bachelor-checkbox',
        leggTilUtdanningMastergrad: '#utdanningsniva-master-checkbox',
        leggTilUtdanningDoktorgrad: '#utdanningsniva-doktorgrad-checkbox',
        leggtilArbeidserfaringKnapp: '#leggtil-arbeidserfaring-knapp',
        leggTilArbeidserfaringInput: '#typeahead-arbeidserfaring',
        leggTilArbeidserfaringUnderEn: '#arbeidserfaring-0-11-checkbox',
        leggTilArbeidserfaringEnTilTre: '#arbeidserfaring-12-47-checkbox',
        leggTilArbeidserfaringFireTilNi: '#arbeidserfaring-48-119-checkbox',
        leggTilArbeidserfaringOverTi: '#arbeidserfaring-120--checkbox',
        leggTilKompetanseKnapp: '#leggtil-kompetanse-knapp',
        leggTilKompetanseInput: '#typeahead-kompetanse',
        leggTilStedKnapp: '#leggtil-sted-knapp',
        leggTilStedInput: '#typeahead-geografi',
        resultatvisning: '.resultatvisning'
    },

    commands: [{
        finnAntallKandidater(antallTreff) {
            return this.getText('@antallKandidaterTreff', (result) => {
                antallTreff.alleTreff.push(parseInt(result.value.replace(' ', ''), 10));
                let lengde = antallTreff.alleTreff.length;
                antallTreff.forste = antallTreff.alleTreff[0];
                antallTreff.nestSiste = antallTreff.alleTreff[lengde - 2];
                antallTreff.siste = antallTreff.alleTreff[lengde - 1];
            });
        },

        seKandidatene() {
            return this
                .waitForElementPresent('@seKandidateneKnapp')
                .click('@seKandidateneKnapp')
                .waitForElementPresent('@resultatvisning');
        },

        leggTilStillingkriterie(stilling, antallTreff) {
            return this
                .finnAntallKandidater(antallTreff)
                .waitForElementPresent('@leggTilStillingKnapp')
                .click('@leggTilStillingKnapp')
                .setValue('@leggTilStillingInput', stilling + this.api.Keys.ENTER)
                .api.pause(4000).page.KandidatsokPage();
        },

        leggTilFagfeltkriterie(fagfelt, antallTreff) {
            return this
                .finnAntallKandidater(antallTreff)
                .waitForElementPresent('@leggTilFagfeltKnapp')
                .click('@leggTilFagfeltKnapp')
                .setValue('@leggTilFagfeltInput', fagfelt + this.api.Keys.ENTER)
                .api.pause(3000).page.KandidatsokPage();
        }
    }]
};
