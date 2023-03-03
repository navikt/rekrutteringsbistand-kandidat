const CracoLessPlugin = require('craco-less');
const postcssPrefixSelector = require('postcss-prefix-selector');

module.exports = {
    style: {
        postcss: {
            plugins: [
                /* Sørger for at alle selektorer får ".rek-kandidat" foran seg slik at stylingen
                   blir scopet til denne appen */
                postcssPrefixSelector({
                    prefix: '.rek-kandidat',
                    exclude: ['html', 'body', '.rek-kandidat'],
                    transform: function (prefix, selector, prefixedSelector, filePath) {
                        /* Ikke transformer CSS-modules fordi disse allerede er scopet */
                        if (filePath.endsWith('.module.css')) {
                            return selector;
                        }

                        if (selector.startsWith('body ')) {
                            return `body ${prefix} ${selector.slice(5)}`;
                        } else if (selector.startsWith('html ')) {
                            return `html ${prefix} ${selector.slice(5)}`;
                        } else if (selector.startsWith('.rek-kandidat ')) {
                            return selector;
                        } else if (selector.includes('modal')) {
                            return selector;
                        }

                        return prefixedSelector;
                    },
                }),
            ],
        },
    },
    plugins: [{ plugin: CracoLessPlugin }],
};
