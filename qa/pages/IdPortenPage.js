/* eslint-disable */
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
                .waitForElementVisible('@idPortenKnapp', 30000)
                .click('@idPortenKnapp')
                .waitForElementVisible('@bankIdKnapp')
                .click('@bankIdKnapp')
                .switchFrame(0) // feltene ligger i en iframe
                .waitForElementVisible('@inputFelt', 60000)
                .setValue('@inputFelt', brukernavn + this.api.Keys.ENTER)
                .idPortenPause(2000)
                .setValue('@inputFelt', engangspassord + this.api.Keys.ENTER)
                .idPortenPause(2000)
                .setValue('@inputFelt', personligPassord + this.api.Keys.ENTER);
        },

        switchFrame(frame) {
            return this.api.frame(frame).page.IdPortenPage();
        },

        idPortenPause(ms) {
            return this.api.pause(ms).page.IdPortenPage();
        }
    }]
};
