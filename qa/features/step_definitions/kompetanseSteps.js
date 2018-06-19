const { client } = require('nightwatch-cucumber');
const { When } = require('cucumber');

When(/jeg legger til kompetanse "('*)"/, (kompetanse) => {
    return 'pending';
});
