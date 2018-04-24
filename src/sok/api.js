/* eslint-disable no-underscore-dangle */

import { SEARCH_API } from '../common/fasitProperties';

const convertToUrlParams = (query) => Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
    .replace(/%20/g, '+');

export class SearchApiError {
    constructor(message, status) {
        this.message = message;
        this.status = status;
    }
}

export async function fetchTypeaheadSuggestions(query = {}) {
    const resultat = await fetch(
        `${SEARCH_API}typeahead?${convertToUrlParams(query)}`, { credentials: 'include' }
    );
    return resultat.json();
}

export async function fetchKandidater(query = {}) {
    let response = await fetch(
        `${SEARCH_API}sok?${convertToUrlParams(query)}`, { credentials: 'include' }
    );

    if (response.status > 400) {
        let error;
        try {
            error = await response.json();
        } catch (e) {
            throw new SearchApiError({
                status: response.status,
                message: response.message
            });
        }
        throw new SearchApiError(error.message, error.status);
    } else {
        response = response.json();
    }
    return response;
}
