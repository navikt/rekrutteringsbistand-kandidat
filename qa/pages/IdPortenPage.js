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
            if (this.api.globals.loginCookie.name) {
                this.api
                    .setCookie(this.api.globals.loginCookie)
                    .execute(`sessionStorage.clear();`) // Fjerner Key preventRedirectToLogin
                    .url(this.api.launch_url);
                return this;
            } else {
                this
                    .waitForElementVisible('@idPortenKnapp', 60000)
                    .click('@idPortenKnapp')
                    .waitForElementVisible('@bankIdKnapp')
                    .click('@bankIdKnapp')
                    .waitForElementVisible('@bankIdFrame')
                    .pagePause(2000)
                    .switchFrame(0) // feltene ligger i en iframe
                    .waitForElementVisible(inputElement, 60000)
                    .setBankIdInputValue(inputElement, brukernavn)
                    .waitForElementVisible(inputElement, 30000)
                    .setBankIdInputValue(inputElement, engangspassord)
                    .waitForElementVisible(inputElement, 30000)
                    .setBankIdInputValue(inputElement, personligPassord)
                    .switchFrame(null);
                return this;
            }
        },

        storeLoginCookie() {
            const self = this;
            if (this.api.globals.loginCookie.name) {
                return this;
            }
            this.api.getCookie('selvbetjening-idtoken', (cookie) => {
                self.api.globals.loginCookie = {
                    domain: cookie.domain,
                    secure: cookie.secure,
                    value: cookie.value,
                    path: cookie.path,
                    httpOnly: cookie.httpOnly,
                    name: cookie.name
                }
            });
            return this;
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
