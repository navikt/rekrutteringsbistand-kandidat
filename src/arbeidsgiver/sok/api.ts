/* eslint-disable no-underscore-dangle */

import { KANDIDATLISTE_API, SEARCH_API, KODEVERK_API } from '../common/fasitProperties';
import FEATURE_TOGGLES from '../../felles/konstanter';
import { deleteReq, fetchJson, postJson, putJson } from '../../felles/api';

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

export function fetchFeatureToggles() {
    return fetchJson(`${SEARCH_API}toggles?feature=${FEATURE_TOGGLES.join(',')}`);
}

export function fetchKandidater(query = {}) {
    return fetchJson(`${SEARCH_API}sok?${convertToUrlParams(query)}`, true);
}

export function fetchKandidaterES(query = {}) {
    return fetchJson(`${SEARCH_API}sok?${convertToUrlParams(query)}`, true);
}

export function fetchCv(arenaKandidatnr) {
    return fetchJson(`${SEARCH_API}hentcv?${convertToUrlParams(arenaKandidatnr)}`, true);
}

export function fetchKandidatlister(orgNummer) {
    return fetchJson(`${KANDIDATLISTE_API}${orgNummer}/kandidatlister`, true);
}

export function postKandidatliste(kandidatlistBeskrivelse, orgNr) {
    return postJson(
        `${KANDIDATLISTE_API}${orgNr}/kandidatlister`,
        JSON.stringify(kandidatlistBeskrivelse)
    );
}

export function postKandidaterTilKandidatliste(kandidatlisteId, kandidater) {
    return postJson(
        `${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}/kandidater`,
        JSON.stringify(kandidater)
    );
}

export function putKandidatliste(kandidatlisteBeskrivelse) {
    return putJson(
        `${KANDIDATLISTE_API}kandidatlister/${kandidatlisteBeskrivelse.kandidatlisteId}`,
        JSON.stringify(kandidatlisteBeskrivelse)
    );
}

export function deleteKandidatliste(kandidatlisteId) {
    return deleteReq(
        `${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}`,
        JSON.stringify(kandidatlisteId)
    );
}

export function fetchGeografiKode(geografiKode) {
    return fetchJson(`${KODEVERK_API}arenageografikoder/${geografiKode}`, true);
}
