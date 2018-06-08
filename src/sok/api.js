/* eslint-disable no-underscore-dangle */

import { SEARCH_API, FEATURE_TOGGLE_API } from '../common/fasitProperties';
import FEATURE_TOGGLES from '../konstanter';

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

async function fetchJson(url) {
    try {
        const response = await fetch(url);
        if (response.status === 200 || response.status === 201) {
            return response.json();
        }
        throw new SearchApiError(undefined, response.status);
    } catch (e) {
        throw new SearchApiError(e.message);
    }
}

export function fetchFeatureToggles() {
    if (process.env.NODE_ENV !== 'development') {
        return fetchJson(`${FEATURE_TOGGLE_API}toggles?feature=${FEATURE_TOGGLES.join(',')}`);
    }
    return __DEVELOPMENT_TOGGLES__; //eslint-disable-line
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
