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
            const inputElement = this.api.options.desiredCapabilities.browserName.toLowerCase() === 'chrome' ? '@inputFeltShadow' : '@inputFelt';
            return this
                .waitForElementVisible('@idPortenKnapp', 30000)
                .click('@idPortenKnapp')
                .waitForElementVisible('@bankIdKnapp')
                .click('@bankIdKnapp')
                .waitForElementVisible('@bankIdFrame')
                .pagePause(2000)
                .switchFrame(0) // feltene ligger i en iframe
                .waitForElementVisible(inputElement, 30000)
                .setBankIdInputValue(inputElement, brukernavn)
                .waitForElementVisible(inputElement, 20000)
                .setBankIdInputValue(inputElement, engangspassord)
                .waitForElementVisible(inputElement, 20000)
                .setBankIdInputValue(inputElement, personligPassord)
                .switchFrame(null);
        },

        setBankIdInputValue(inputElement, inputValue) {
            const self = this;
            const shadowDom = this.api.options.desiredCapabilities.browserName.toLowerCase() === 'chrome' ? '.full_width_height::shadow ' : '';
            return this.getAttribute(inputElement, 'id', (result) => {
                self.setValue(`${shadowDom}#${result.value}`, inputValue + this.api.Keys.ENTER)
                    .waitForElementNotPresent(`${shadowDom}#${result.value}`)
            })
        },

        switchFrame(frame) {
            return this.api.frame(frame).page.IdPortenPage();
        }
    }]
};
