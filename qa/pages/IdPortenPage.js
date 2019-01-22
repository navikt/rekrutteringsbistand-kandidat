/* eslint-disable */
module.exports = {
    elements: {
        idPortenKnapp: '#IdPortenExchange',
        bankIdKnapp: '#BankIDJS',
        bankIdFrame: 'iframe[title=BankID]',
        inputFelt: 'input[data-bind]', // input-feltet ligger under shadow DOM, må derfor bruke element før og etter ::shadow
        inputFeltShadow: '.full_width_height::shadow input[data-bind]' // input-feltet ligger under shadow DOM, må derfor bruke element før og etter ::shadow
    },

    commands: [{
        loggInn(brukernavn) {
            const engangspassord = 'otp';
            const personligPassord = 'qwer1234';
            const inputElement = this.api.options.desiredCapabilities.browserName === 'chrome' ? '@inputFeltShadow' : '@inputFelt';
            return this
                .waitForElementVisible('@idPortenKnapp', 30000)
                .click('@idPortenKnapp')
                .waitForElementVisible('@bankIdKnapp')
                .click('@bankIdKnapp')
                .waitForElementPresent('@bankIdFrame')
                .switchFrame(0) // feltene ligger i en iframe
                .waitForElementVisible(inputElement, 20000)
                .setValue(inputElement, brukernavn + this.api.Keys.ENTER)
                .pagePause(2000)
                .setValue(inputElement, engangspassord + this.api.Keys.ENTER)
                .pagePause(2000)
                .setValue(inputElement, personligPassord + this.api.Keys.ENTER)
                .switchFrame(null);
        },

        switchFrame(frame) {
            return this.api.frame(frame).page.IdPortenPage();
        }
    }]
};
