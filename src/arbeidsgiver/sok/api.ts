import { SEARCH_API } from '../common/fasitProperties';

const convertToUrlParams = query =>
    Object.keys(query)
        .map(key => {
            if (Array.isArray(query[key])) {
                const encodedKey = encodeURIComponent(key);
                return query[key]
                    .map(v => `${encodedKey}=${encodeURIComponent(v)}`)
                    .reduce((accumulator, current) => `${accumulator}&${current}`, '');
            } else {
                return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
            }
        })
        .join('&')
        .replace(/%20/g, '+');

export async function fetchTypeaheadSuggestionsRest(query = {}) {
    const resultat = await fetch(`${SEARCH_API}typeahead$?${convertToUrlParams(query)}`, {
        credentials: 'include',
    });
    return resultat.json();
}
