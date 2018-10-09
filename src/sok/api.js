/* eslint-disable no-underscore-dangle */

import { KANDIDATLISTE_API, SEARCH_API, ORGANISASJON_API, USE_JANZZ } from '../common/fasitProperties';
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

export async function fetchTypeaheadSuggestionsRest(query = {}) {
    const resultat = await fetch(
        `${SEARCH_API}typeahead${USE_JANZZ ? 'Match' : ''}?${convertToUrlParams(query)}`, { credentials: 'include' }
    );
    return resultat.json();
}

export async function fetchTypeaheadJanzzGeografiSuggestions(query = {}) {
    const resultat = await fetch(
        `${SEARCH_API}typeaheadSted${USE_JANZZ ? 'Match' : ''}?${convertToUrlParams(query)}`, { credentials: 'include' }
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

async function postJson(url, bodyString) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200 || response.status === 201) {
            return;
        }
        throw new SearchApiError({
            status: response.status
        });
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status
        });
    }
}

async function putJson(url, bodyString) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'PUT',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200 || response.status === 201) {
            return;
        }
        throw new SearchApiError({
            status: response.status
        });
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status
        });
    }
}

async function deleteReq(url, bodyString) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'DELETE',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status <= 202) {
            return response.json();
        }
        throw new SearchApiError({
            status: response.status
        });
    } catch (e) {
        throw new SearchApiError({
            message: e.message,
            status: e.status
        });
    }
}

export function fetchFeatureToggles() {
    return fetchJson(`${SEARCH_API}toggles?feature=${FEATURE_TOGGLES.join(',')}`);
}

export function fetchKandidater(query = {}) {
    return fetchJson(
        `${SEARCH_API}sok${USE_JANZZ ? 'Match' : ''}?${convertToUrlParams(query)}`, true
    );
}

export function fetchKandidaterUtenCriteria(query = {}) {
    return fetchJson(
        `${SEARCH_API}sok?${convertToUrlParams(query)}`, true
    );
}

export function fetchCv(arenaKandidatnr) {
    return fetchJson(
        `${SEARCH_API}hentcv?${convertToUrlParams(arenaKandidatnr)}`, true
    );
}

export function fetchMatchExplain(query = {}) {
    return fetchJson(
        `${SEARCH_API}hentmatchforklaring?${convertToUrlParams(query)}`, true
    );
}

export function fetchKandidatlister(orgNummer) {
    return fetchJson(
        `${KANDIDATLISTE_API}${orgNummer}/kandidatlister`, true
    );
}

export function postKandidatliste(kandidatlistBeskrivelse, orgNr) {
    return postJson(`${KANDIDATLISTE_API}${orgNr}/kandidatlister`, JSON.stringify(kandidatlistBeskrivelse));
}

export function postKandidaterTilKandidatliste(kandidatlisteId, kandidater) {
    return postJson(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}/kandidater`, JSON.stringify(kandidater));
}

export function putKandidatliste(kandidatlisteBeskrivelse) {
    return putJson(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteBeskrivelse.kandidatlisteId}`, JSON.stringify(kandidatlisteBeskrivelse));
}

export function fetchArbeidsgivere() {
    return fetchJson(`${ORGANISASJON_API}`, true);
}

export function fetchKandidatliste(kandidatlisteId) {
    return fetchJson(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}`, true);
}

export function deleteKandidater(kandidatlisteId, listeMedKandidatId) {
    return deleteReq(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}/kandidater`, JSON.stringify(listeMedKandidatId));
}
