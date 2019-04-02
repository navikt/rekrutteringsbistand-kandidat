/* eslint-disable */
exports.command = function (brukernavn, loggInnType) {
    const idPortenPage = this.page.IdPortenPage();
    const kandidatsokPage = this.page.KandidatsokPage();

    this
        .url(this.launch_url)
        .maximizeWindow();

    if (this.globals.environment === 'local') {
        kandidatsokPage
            .click('@kandidatsokLink')
            .waitForElementVisible('@velgArbeidsgiverDropdown', 20000)
            .setValue('@velgArbeidsgiverDropdown', 'Aust' + this.Keys.ENTER)
            .waitForElementPresent('@antallKandidaterTreff', 30000);
    } else {
        if (this.globals.loginCookie.name) {
            this
                .setCookie(this.globals.loginCookie)
                .execute(`sessionStorage.clear();`) // Fjerner Key preventRedirectToLogin
                .url(this.launch_url);
            kandidatsokPage.waitForElementPresent('@antallKandidaterTreff', 30000);
        } else {
            idPortenPage
                .loggInnIdPorten(brukernavn, loggInnType);
        }
    }
};
