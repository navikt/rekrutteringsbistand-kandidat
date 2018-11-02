/* eslint-disable */
// Funksjon som gjør det enkelt å vente litt før, og evt etter, et klikk.
// pageObject, pauseBefore og pauseAfter er valgfrie parametere.
exports.command = function (element, pageObject, pauseBefore = 100, pauseAfter = 100) {
    const client = (typeof pageObject === 'undefined') ? this : pageObject;

    client.waitForElementVisible(element);
    this.pause(pauseBefore);
    client.click(element);
    this.pause(pauseAfter);
    return client;
};
