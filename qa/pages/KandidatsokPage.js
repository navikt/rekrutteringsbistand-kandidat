/* eslint-disable */
module.exports = {
    elements: {
        kandidatsokLink: 'a[href="/kandidater"]',
        antallKandidaterTreff: '#antall-kandidater-treff',
        slettAlleKriterierLenke: '#slett-alle-kriterier-lenke',
        leggTilStillingKnapp: '#leggtil-stilling-knapp',
        leggTilStillingInput: '#typeahead-stilling',
        leggTilStillingTypeahead: '#typeahead-stilling-suggestions',
        leggTilFagfeltKnapp: '#leggtil-fagfelt-knapp',
        leggTilFagfeltInput: '#yrke',
        leggTilFagfeltTypeahead: '#yrke-suggestions',
        leggTilUtdanningIngen: 'label[for=utdanningsniva-ingen-checkbox]',
        leggTilUtdanningVideregaende: 'label[for=utdanningsniva-videregaende-checkbox]',
        leggTilUtdanningFagskole: 'label[for=utdanningsniva-fagskole-checkbox]',
        leggTilUtdanningBachelorgrad: 'label[for=utdanningsniva-bachelor-checkbox]',
        leggTilUtdanningMastergrad: 'label[for=utdanningsniva-master-checkbox]',
        leggTilUtdanningDoktorgrad: 'label[for=utdanningsniva-doktorgrad-checkbox]',
        leggTilArbeidserfaringKnapp: '#leggtil-arbeidserfaring-knapp',
        leggTilArbeidserfaringInput: '#typeahead-arbeidserfaring',
        leggTilArbeidserfaringTypeahead: '#typeahead-arbeidserfaring-suggestions',
        leggTilArbeidserfaringUnderEn: 'label[for=arbeidserfaring-0-11-checkbox]',
        leggTilArbeidserfaringEnTilTre: 'label[for=arbeidserfaring-12-47-checkbox]',
        leggTilArbeidserfaringFireTilNi: 'label[for=arbeidserfaring-48-119-checkbox]',
        leggTilArbeidserfaringOverTi: 'label[for=arbeidserfaring-120--checkbox]',
        leggTilSprakKnapp: '#leggtil-sprak-knapp',
        leggTilSprakInput: '#yrke',
        leggTilSprakTypeahead: '#yrke-suggestions',
        leggTilForerkortKnapp: '#leggtil-forerkort-knapp',
        leggTilForerkortInput: '#typeahead-forerkort',
        leggTilForerkortTypeahead: '#typeahead-forerkort-suggestions',
        leggTilKompetanseKnapp: '#leggtil-kompetanse-knapp',
        leggTilKompetanseInput: '#typeahead-kompetanse',
        leggTilKompetanseTypeahead: '#typeahead-kompetanse-suggestions',
        leggTilStedKnapp: '#leggtil-sted-knapp',
        leggTilStedInput: '#typeahead-geografi',
        leggTilStedTypeahead: '#typeahead-geografi-suggestions',
        sokefeltKnapp: '#search-button-typeahead',
        resultatvisning: 'div[class=resultatvisning]',
        forsteRadKandidaterTabell: '.lenke--kandidatnr',
        cvModal: '.personalia--modal',
        viserAntallTreff: '.antall-treff-kandidatervisning',
        velgArbeidsgiverDropdown: '#arbeidsgiver-select',
        markerAlleKandidaterCheckbox: '#marker-alle-kandidater-checkbox',
        lagreKandidaterKnapp: '#lagre-kandidater-knapp',
        forsteKandidatliste: 'input[id^="marker-liste"]',
        lagreKandidaterIListeKnapp: '#lagre-kandidater-i-liste',
        hjelpetekstfading: '#hjelpetekstfading'
    },

    commands: [{
        finnAntallKandidater(antallTreff, callback) {
            this.getText('@antallKandidaterTreff', (result) => {
                this.assert.equal(result.status, 0);
                antallTreff.alleTreff.push(parseInt(result.value.replace(' ', ''), 10));
                let lengde = antallTreff.alleTreff.length;
                antallTreff.forste = antallTreff.alleTreff[0];
                antallTreff.nestSiste = antallTreff.alleTreff[lengde - 2];
                antallTreff.siste = antallTreff.alleTreff[lengde - 1];

                if (callback && typeof callback === 'function') {
                    callback(antallTreff.siste);
                }
            });
            return this;
        },

        leggTilStillingkriterie(stilling, antallTreff) {
            const self = this;
            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementVisible('@leggTilStillingKnapp')
                    .clickElement('@leggTilStillingKnapp', self, 1000, 1000)
                    .setValue('@leggTilStillingInput', stilling)
                    .waitForElementVisible('@leggTilStillingTypeahead')
                    .setValue('@leggTilStillingInput', self.api.Keys.ENTER)
                    .api.useXpath()
                    .waitForElementVisible(`//span[text()="${stilling}"]`)
                    .expect.element('//span[contains(., antall-kandidater-treff)]').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        leggTilUtdanningkriterie(utdanning, antallTreff) {
            const self = this;
            let checkboxElement;

            if (utdanning === 'Ingen utdanning') checkboxElement = '@leggTilUtdanningIngen';
            else if (utdanning === 'Videregående') checkboxElement = '@leggTilUtdanningVideregaende';
            else if (utdanning === 'Fagskole') checkboxElement = '@leggTilUtdanningFagskole';
            else if (utdanning === 'Bachelorgrad') checkboxElement = '@leggTilUtdanningBachelorgrad';
            else if (utdanning === 'Mastergrad') checkboxElement = '@leggTilUtdanningMastergrad';
            else if (utdanning === 'Doktorgrad') checkboxElement = '@leggTilUtdanningDoktorgrad';
            else throw `'${utdanning}' er ikke et støttet utdanningsnivå`;

            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementVisible(checkboxElement)
                    .click(checkboxElement)
                    .expect.element('@antallKandidaterTreff').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        leggTilFagfeltkriterie(fagfelt, antallTreff) {
            const self = this;
            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementVisible('@leggTilFagfeltKnapp')
                    .clickElement('@leggTilFagfeltKnapp', self, 1000, 1000)
                    .setValue('@leggTilFagfeltInput', fagfelt)
                    .waitForElementVisible('@leggTilFagfeltTypeahead')
                    .setValue('@leggTilFagfeltInput', self.api.Keys.ENTER)
                    .click('@antallKandidaterTreff')
                    .api.useXpath()
                    .waitForElementVisible(`//span[text()="${fagfelt}"]`)
                    .expect.element('//span[contains(., antall-kandidater-treff)]').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        leggTilArbeidserfaringkriterie(arbeidserfaring, antallTreff) {
            const self = this;
            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementVisible('@leggTilArbeidserfaringKnapp')
                    .clickElement('@leggTilArbeidserfaringKnapp', self, 1000, 1000)
                    .setValue('@leggTilArbeidserfaringInput', arbeidserfaring)
                    .waitForElementVisible('@leggTilArbeidserfaringTypeahead')
                    .setValue('@leggTilArbeidserfaringInput', self.api.Keys.ENTER)
                    .click('@antallKandidaterTreff')
                    .api.useXpath()
                    .waitForElementVisible(`//span[text()="${arbeidserfaring}"]`)
                    .expect.element('//span[contains(., antall-kandidater-treff)]').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        leggTilArMedArbeidserfaringkriterie(ar, antallTreff) {
            const self = this;
            let checkboxElement;
            if (ar === 'Under 1 år') checkboxElement = '@leggTilArbeidserfaringUnderEn';
            else if (ar === '1-3 år') checkboxElement = '@leggTilArbeidserfaringEnTilTre';
            else if (ar === '4-9 år') checkboxElement = '@leggTilArbeidserfaringFireTilNi';
            else if (ar === 'Over 10 år') checkboxElement = '@leggTilArbeidserfaringOverTi';
            else throw `'${ar}' er ikke et støttet antall år med arbeidserfaring`;

            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementPresent(checkboxElement)
                    .click(checkboxElement)
                    .api.useXpath()
                    .expect.element('//span[contains(., antall-kandidater-treff)]').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        leggTilSprakkriterie(sprak, antallTreff) {
            const self = this;
            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementPresent('@leggTilSprakKnapp')
                    .clickElement('@leggTilSprakKnapp', self, 1000, 1000)
                    .setValue('@leggTilSprakInput', sprak)
                    .waitForElementVisible('@leggTilSprakTypeahead', 30000)
                    .setValue('@leggTilSprakInput', self.api.Keys.ENTER)
                    .click('@antallKandidaterTreff')
                    .api.useXpath()
                    .waitForElementVisible(`//span[text()="${sprak}"]`)
                    .expect.element('//span[contains(., antall-kandidater-treff)]').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        leggTilForerkortkriterie(forerkort, antallTreff) {
            const self = this;
            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementPresent('@leggTilForerkortKnapp')
                    .clickElement('@leggTilForerkortKnapp', self, 1000, 1000)
                    .setValue('@leggTilForerkortInput', forerkort)
                    .waitForElementVisible('@leggTilForerkortTypeahead', 30000)
                    .setValue('@leggTilForerkortInput', self.api.Keys.ENTER)
                    .click('@antallKandidaterTreff')
                    .api.useXpath()
                    .waitForElementVisible(`//span[text()="${forerkort}"]`)
                    .expect.element('//span[contains(., antall-kandidater-treff)]').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        leggTilKompetansekriterie(kompetanse, antallTreff) {
            const self = this;
            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementVisible('@leggTilKompetanseKnapp')
                    .clickElement('@leggTilKompetanseKnapp', self, 1000, 1000)
                    .setValue('@leggTilKompetanseInput', kompetanse)
                    .waitForElementVisible('@leggTilKompetanseTypeahead')
                    .setValue('@leggTilKompetanseInput', self.api.Keys.ENTER)
                    .click('@antallKandidaterTreff')
                    .api.useXpath()
                    .waitForElementVisible(`//span[text()="${kompetanse}"]`)
                    .expect.element('//span[contains(., antall-kandidater-treff)]').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        leggTilGeografikriterie(sted, antallTreff) {
            const self = this;
            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .waitForElementVisible('@leggTilStedKnapp')
                    .clickElement('@leggTilStedKnapp', self, 1000, 1000)
                    .setValue('@leggTilStedInput', sted)
                    .waitForElementVisible('@leggTilStedTypeahead', 30000)
                    .setValue('@leggTilStedInput', self.api.Keys.ENTER)
                    .click('@antallKandidaterTreff')
                    .expect.element('@antallKandidaterTreff').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        slettAlleKriterier(antallTreff) {
            const self = this;
            return this.finnAntallKandidater(antallTreff, function(antallTreffSiste) {
                self
                    .click('@slettAlleKriterierLenke')
                    .api.useXpath()
                    .expect.element('//span[contains(., antall-kandidater-treff)]').text.to.not.equal(antallTreffSiste.toString()).before(30000);
            });
        },

        markerKandidater(antallKandidater) {
            const self = this;
            this.api.elements('css selector', 'input[id^="marker-kandidat-"]', (result) => {
                for (let i = 0; i < antallKandidater; i++) {
                    self.api.elementIdValue(result.value[i].ELEMENT, self.api.Keys.SPACE);
                }
            });
            return this;
        }
    }]
};
