module.exports = {
    elements: {
        sideInnhold: '.search-page',
        antallKandidaterTreff: '#antall-kandidater-treff',
        seKandidateneKnapp: '#se-kandidatene-knapp',
        slettAlleKriterierLenke: '#slett-alle-kriterier-lenke',
        leggTilStillingKnapp: '#leggtil-stilling-knapp',
        leggTilStillingInput: '#typeahead-stilling',
        leggTilFagfeltKnapp: '#leggtil-fagfelt-knapp',
        leggTilFagfeltInput: '#yrke',
        leggTilUtdanningIngen: 'label[for=utdanningsniva-ingen-checkbox]',
        leggTilUtdanningVideregaende: 'label[for=utdanningsniva-videregaende-checkbox]',
        leggTilUtdanningFagskole: 'label[for=utdanningsniva-fagskole-checkbox]',
        leggTilUtdanningBachelorgrad: 'label[for=utdanningsniva-bachelor-checkbox]',
        leggTilUtdanningMastergrad: 'label[for=utdanningsniva-master-checkbox]',
        leggTilUtdanningDoktorgrad: 'label[for=utdanningsniva-doktorgrad-checkbox]',
        leggTilArbeidserfaringKnapp: '#leggtil-arbeidserfaring-knapp',
        leggTilArbeidserfaringInput: '#typeahead-arbeidserfaring',
        leggTilArbeidserfaringUnderEn: 'label[for=arbeidserfaring-0-11-checkbox]',
        leggTilArbeidserfaringEnTilTre: 'label[for=arbeidserfaring-12-47-checkbox]',
        leggTilArbeidserfaringFireTilNi: 'label[for=arbeidserfaring-48-119-checkbox]',
        leggTilArbeidserfaringOverTi: 'label[for=arbeidserfaring-120--checkbox]',
        leggTilKompetanseKnapp: '#leggtil-kompetanse-knapp',
        leggTilKompetanseInput: '#typeahead-kompetanse',
        leggTilStedKnapp: '#leggtil-sted-knapp',
        leggTilStedInput: '#typeahead-geografi',
        resultatvisning: 'div[class=resultatvisning]',
        forsteRadKandidaterTabell: 'button[class*=kandidater--row]',
        cvModal: '.personalia--modal'
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
                .pageWait(4000);
        },

        leggTilUtdanningkriterie(utdanning, antallTreff) {
            let checkboxElement;
            if (utdanning === 'Ingen utdanning') checkboxElement = '@leggTilUtdanningIngen';
            else if (utdanning === 'Videregående') checkboxElement = '@leggTilUtdanningVideregaende';
            else if (utdanning === 'Fagskole') checkboxElement = '@leggTilUtdanningFagskole';
            else if (utdanning === 'Bachelorgrad') checkboxElement = '@leggTilUtdanningBachelorgrad';
            else if (utdanning === 'Mastergrad') checkboxElement = '@leggTilUtdanningMastergrad';
            else if (utdanning === 'Doktorgrad') checkboxElement = '@leggTilUtdanningDoktorgrad';
            else throw `'${utdanning}' er ikke et støttet utdanningsnivå`;
            return this
                .finnAntallKandidater(antallTreff)
                .waitForElementPresent(checkboxElement)
                .click(checkboxElement)
                .pageWait(4000);
        },

        leggTilFagfeltkriterie(fagfelt, antallTreff) {
            return this
                .finnAntallKandidater(antallTreff)
                .waitForElementPresent('@leggTilFagfeltKnapp')
                .click('@leggTilFagfeltKnapp')
                .setValue('@leggTilFagfeltInput', fagfelt + this.api.Keys.ENTER)
                .pageWait(4000);
        },

        leggTilArbeidserfaringkriterie(arbeidserfaring, antallTreff) {
            return this
                .finnAntallKandidater(antallTreff)
                .waitForElementPresent('@leggTilArbeidserfaringKnapp')
                .click('@leggTilArbeidserfaringKnapp')
                .setValue('@leggTilArbeidserfaringInput', arbeidserfaring + this.api.Keys.ENTER)
                .pageWait(4000);
        },

        leggTilArMedArbeidserfaringkriterie(ar, antallTreff) {
            let checkboxElement;
            if (ar === 'Under 1 år') checkboxElement = '@leggTilArbeidserfaringUnderEn';
            else if (ar === '1-3 år') checkboxElement = '@leggTilArbeidserfaringEnTilTre';
            else if (ar === '4-9 år') checkboxElement = '@leggTilArbeidserfaringFireTilNi';
            else if (ar === 'Over 10 år') checkboxElement = '@leggTilArbeidserfaringOverTi';
            else throw `'${ar}' er ikke et støttet antall år med arbeidserfaring`;
            return this
                .finnAntallKandidater(antallTreff)
                .waitForElementPresent(checkboxElement)
                .click(checkboxElement)
                .pageWait(4000);
        },

        leggTilKompetansekriterie(kompetanse, antallTreff) {
            return this
                .finnAntallKandidater(antallTreff)
                .waitForElementPresent('@leggTilKompetanseKnapp')
                .click('@leggTilKompetanseKnapp')
                .setValue('@leggTilKompetanseInput', kompetanse + this.api.Keys.ENTER)
                .pageWait(4000);
        },

        leggTilGeografikriterie(sted, antallTreff) {
            return this
                .finnAntallKandidater(antallTreff)
                .waitForElementPresent('@leggTilStedKnapp')
                .click('@leggTilStedKnapp')
                .setValue('@leggTilStedInput', sted)
                .pageWait(500)
                .setValue('@leggTilStedInput', this.api.Keys.ENTER)
                .pageWait(4000);
        },

        skalVisesTreffSomMatcher(kriterie) {
            return this.getText('@resultatvisning', (result) => {
                console.log(result.value);
            });
        },

        slettAlleKriterier() {
            return this
                .click('@slettAlleKriterierLenke')
                .pageWait(4000);
        },

        skalVisesTreffSomMatcherAr(ar) {
            return this.getText('@resultatvisning', (result) => {
                console.log(result.value);
            });
        },

        pageWait(ms) {
            return this.api.pause(ms).page.KandidatsokPage();
        }
    }]
};
