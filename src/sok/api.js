/* eslint-disable no-underscore-dangle */

import { SEARCH_API } from '../common/fasitProperties';
import FEATURE_TOGGLES from '../konstanter';

const convertToUrlParams = (query) => Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
    .replace(/%20/g, '+');

export class SearchApiError {
    constructor(error) {
        this.message = error.message;
        this.status = error.status;
    }
}

export async function fetchTypeaheadSuggestions(query = {}) {
    const resultat = await fetch(
        `${SEARCH_API}typeahead?${convertToUrlParams(query)}`, { credentials: 'include' }
    );
    return resultat.json();
}

async function fetchJson(url, includeCredentials) {
    try {
        let response;
        if (includeCredentials) {
            response = await fetch(url, { credentials: 'include' });
        } else {
            response = await fetch(url);
        }
        if (response.status === 200 || response.status === 201) {
            return response.json();
        }
        let error;
        try {
            error = await response.json();
        } catch (e) {
            throw new SearchApiError({
                status: response.status,
                message: response.statusText
            });
        }
        throw new SearchApiError({
            message: error.message,
            status: error.status
        });
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status
        });
    }
}

export function fetchFeatureToggles() {
    if (process.env.NODE_ENV !== 'development') {
        return fetchJson(`${SEARCH_API}toggles?feature=${FEATURE_TOGGLES.join(',')}`);
    }
    return __DEVELOPMENT_TOGGLES__; //eslint-disable-line
}

export function fetchKandidater(query = {}) {
    return fetchJson(
        `${SEARCH_API}sok?${convertToUrlParams(query)}`, true
    );
}

export function fetchCv(arenaKandidatnr) {
    return fetchJson(
        `${SEARCH_API}hentcv?${convertToUrlParams(arenaKandidatnr)}`, true
    );
}
