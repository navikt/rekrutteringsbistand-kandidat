module.exports = {
    elements: {
        sideInnhold: '.search-page',
        searchResult: '#sokeresultat'
    },

    commands: [{
        doTextSearch(text) {
            return this.setValue('@searchTextField', text + this.api.Keys.ENTER);
        }
    }]
};
