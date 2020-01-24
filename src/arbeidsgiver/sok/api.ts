/* eslint-disable no-underscore-dangle */

import {
    KANDIDATLISTE_API,
    SEARCH_API,
    ONTOLOGY_SEARCH_API_URL,
    ORGANISASJON_API,
    USE_JANZZ,
    SAMTYKKE_API,
    KODEVERK_API,
    METRICS_SUPPORT_URL
} from '../common/fasitProperties';
import FEATURE_TOGGLES from '../../felles/konstanter';
import {
    deleteReq,
    fetchJson,
    postJson,
    putJson,
} from '../../felles/api';
import {registerCompanyMetrics} from "../../felles/googleanalytics";

const convertToUrlParams = (query) => Object.keys(query)
    .map((key) => {
        if (Array.isArray(query[key])) {
            const encodedKey = encodeURIComponent(key);
            return query[key].map(v => `${encodedKey}=${encodeURIComponent(v)}`)
                .reduce((accumulator, current) => `${accumulator}&${current}`, '');
        } else {
            return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
        }
    })
    .join('&')
    .replace(/%20/g, '+');

export async function fetchTypeaheadSuggestionsRest(query = {}) {
    const resultat = await fetch(
        `${SEARCH_API}typeahead${USE_JANZZ ? 'Match' : ''}?${convertToUrlParams(query)}`, { credentials: 'include' }
    );
    return resultat.json();
}

export async function fetchTypeaheadSuggestionsOntology(query = {}) {
    const resultat = await fetch(
        `${ONTOLOGY_SEARCH_API_URL}/stillingstittel?${convertToUrlParams(query)}`, { credentials: 'include' }
    );
    return resultat.json();
}

export async function fetchTypeaheadJanzzGeografiSuggestions(query = {}) {
    const resultat = await fetch(
        `${SEARCH_API}typeaheadSted${USE_JANZZ ? 'Match' : ''}?${convertToUrlParams(query)}`, { credentials: 'include' }
    );
    return resultat.json();
}

export function fetchFeatureToggles() {
    return fetchJson(`${SEARCH_API}toggles?feature=${FEATURE_TOGGLES.join(',')}`);
}

export function fetchKandidater(query = {}) {
    if (USE_JANZZ) {
        return postJson(
            `${SEARCH_API}sokMatch`, JSON.stringify(query)
        );
    }
    return fetchJson(
        `${SEARCH_API}sok?${convertToUrlParams(query)}`, true
    );
}

export function fetchKandidaterES(query = {}) {
    return fetchJson(
        `${SEARCH_API}sok?${convertToUrlParams(query)}`, true
    );
}

export function fetchCv(arenaKandidatnr) {
    return fetchJson(
        `${SEARCH_API}hentcv?${convertToUrlParams(arenaKandidatnr)}`, true
    );
}

export function fetchMatchExplainFraId(query = {}) {
    return fetchJson(
        `${SEARCH_API}hentmatchforklaringFraId?${convertToUrlParams(query)}`, true
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

export function deleteKandidatliste(kandidatlisteId) {
    return deleteReq(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}`, JSON.stringify(kandidatlisteId));
}

export function sjekkTokenGaarUtSnart() {
    return fetchJson(`${SEARCH_API}validertoken`, true);
}

export function fetchVilkarstekst() {
    return fetchJson(`${SAMTYKKE_API}`, true);
}

export function postGodtaGjeldendeVilkar() {
    return postJson(`${SAMTYKKE_API}`, JSON.stringify(true));
}

export function fetchGeografiKode(geografiKode) {
    return fetchJson(`${KODEVERK_API}arenageografikoder/${geografiKode}`, true);
}

export function fetchArbeidsgiverClass(orgNummer) {
    return fetch(`${METRICS_SUPPORT_URL}companies/${orgNummer}/classification`);
}

export function logArbeidsgiverMetrics(arbeidsgiver, orgNummer) {
    if (arbeidsgiver.klasse !== "Udefinert") registerCompanyMetrics(arbeidsgiver.klasse);
    return fetch(`${METRICS_SUPPORT_URL}companies/${orgNummer}/metrics/companyLoggedIn`, {
        method: 'POST',
        body: JSON.stringify(arbeidsgiver),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
