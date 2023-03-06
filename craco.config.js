const CracoLessPlugin = require('craco-less');
const postcssPrefixSelector = require('postcss-prefix-selector');

const appScope = '.rek-kandidat';

const prefiksStylingMedAppScope = (prefix, selector, prefixedSelector, filePath) => {
    /* Ikke transformer CSS-modules fordi disse allerede er scopet */
    if (filePath.endsWith('.module.css')) {
        return selector;
    }

    if (selector.startsWith('body ')) {
        return `body ${prefix} ${selector.slice(5)}`;
    } else if (selector.startsWith('html ')) {
        return `html ${prefix} ${selector.slice(5)}`;
    } else if (selector.startsWith(appScope + ' ')) {
        return selector;
    } else if (selector.includes('modal')) {
        return selector;
    }

    return prefixedSelector;
};

module.exports = {
    style: {
        postcss: {
            plugins: [
                postcssPrefixSelector({
                    prefix: appScope,
                    exclude: ['html', 'body', ':root', appScope],
                    transform: prefiksStylingMedAppScope,
                }),
            ],
        },
    },
    plugins: [{ plugin: CracoLessPlugin }],
};
