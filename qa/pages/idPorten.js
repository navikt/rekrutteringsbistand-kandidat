module.exports = {
    elements: {
        idPortenKnapp: '#IdPortenExchange',
        bankIdKnapp: '#BankIDJS',
        inputFelt: '.full_width_height::shadow input[data-bind]' // input-feltet ligger under shadow DOM, må derfor bruke element før og etter ::shadow
    },

    commands: [{
        loggInn(brukernavn) {
            const engangspassord = 'otp';
            const personligPassord = 'qwer1234';
            return this
                .waitForElementPresent('@idPortenKnapp', 10000)
                .click('@idPortenKnapp')
                .click('@bankIdKnapp')
                .switchFrame(0) // feltene ligger i en iframe
                .waitForElementPresent('@inputFelt')
                .setValue('@inputFelt', brukernavn + this.api.Keys.ENTER)
                .idPortenPause(1000)
                .setValue('@inputFelt', engangspassord + this.api.Keys.ENTER)
                .idPortenPause(1000)
                .setValue('@inputFelt', personligPassord + this.api.Keys.ENTER);
        },

        switchFrame(frame) {
            return this.api.frame(frame).page.idPorten();
        },

        idPortenPause(ms) {
            return this.api.pause(ms).page.idPorten();
        }
    }]
};
