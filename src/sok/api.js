/* eslint-disable no-underscore-dangle */

import { SEARCH_API } from '../common/fasitProperties';

const convertToUrlParams = (query) => Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
    .replace(/%20/g, '+');

export class SearchApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

async function post(query, url) {
    let response;
    try {
        response = await fetch(url, {
            body: JSON.stringify(query),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}


export async function fetchTypeaheadSuggestions(query = {}) {
    const resultat = await fetch(
        `${SEARCH_API}typeahead?${convertToUrlParams(query)}`
    );
    return resultat.json();
}

export async function fetchKandidater(query = {}) {
    const resultat = await fetch(
        `${SEARCH_API}sok?${convertToUrlParams(query)}`
    );
    return resultat.json();
}
