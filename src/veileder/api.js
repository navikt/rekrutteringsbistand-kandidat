/* eslint-disable no-underscore-dangle */

import { SEARCH_API, KANDIDATSOK_API, KANDIDATLISTE_API, KODEVERK_API } from './common/fasitProperties';
import FEATURE_TOGGLES from './../felles/konstanter';

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
        `${SEARCH_API}/typeahead?${convertToUrlParams(query)}`, { credentials: 'include' }
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

const getCookie = (name) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : '';
};

async function postJson(url, bodyString) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                Accept: 'application/json'
            },
            mode: 'cors'
        });
        if (response.status === 200 || response.status === 201) {
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

async function putJson(url, bodyString) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'PUT',
            body: bodyString,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            },
            mode: 'cors'
        });
        if (response.status === 200 || response.status === 201) {
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

async function putRequest(url) {
    try {
        const response = await fetch(url, {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN')
            },
            mode: 'cors'
        });
        if (response.status >= 200 && response.status < 300) {
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

export function fetchFeatureToggles() {
    return fetchJson(`${SEARCH_API}/toggles?feature=${FEATURE_TOGGLES.join(',')}`);
}

export const fetchInnloggetVeileder = () => (
    fetchJson(`${KANDIDATSOK_API}/veileder/me`, true)
);

export function fetchKandidater(query = {}) {
    return fetchJson(
        `${SEARCH_API}/sok?${convertToUrlParams(query)}`, true
    );
}

export function fetchKandidaterES(query = {}) {
    return fetchJson(
        `${SEARCH_API}/sok?${convertToUrlParams(query)}`, true
    );
}

export function fetchCv(arenaKandidatnr) {
    return fetchJson(
        `${SEARCH_API}/hentcv?${convertToUrlParams(arenaKandidatnr)}`, true
    );
}

export const fetchKandidatliste = (stillingsId) => (
    fetchJson(`${KANDIDATLISTE_API}/stilling/${stillingsId}/kandidatliste`, true)
);

export const putStatusKandidat = (status, kandidatlisteId, kandidatnr) => (
    putJson(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/status`, JSON.stringify({ status }))
);

export function putKandidatliste(stillingsId) {
    return putRequest(`${KANDIDATLISTE_API}/stilling/${stillingsId}/kandidatliste/`);
}

export function fetchGeografiKode(geografiKode) {
    return fetchJson(`${KODEVERK_API}/arenageografikoder/${geografiKode}`, true);
}

export const fetchStillingFraListe = (stillingsId) => (
    fetchJson(`${KANDIDATSOK_API}/kandidatsok/stilling/sokeord/${stillingsId}`, true)
);

export const fetchDataFraListe = (stillingsId) => (
    fetchJson(`${KANDIDATLISTE_API}/stilling/${stillingsId}/kandidatliste`, true)
);

export const fetchKandidatMedFnr = (fnr) => (
    fetchJson(`${SEARCH_API}/fnrsok/${fnr}`, true)
);

export const fetchNotater = (kandidatlisteId, kandidatnr) => (
    fetchJson(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`, true)
);

export const postDelteKandidater = (beskjed, mailadresser, kandidatlisteId, kandidatnummerListe) => (
    postJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/deltekandidater`,
        JSON.stringify({
            epostMottakere: mailadresser,
            epostTekst: beskjed,
            kandidater: kandidatnummerListe
        })
    )
);

export const postKandidaterTilKandidatliste = (kandidatlisteId, kandidater) => (
    postJson(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater`, JSON.stringify(kandidater))
);

export const postNotat = (kandidatlisteId, kandidatnr, tekst) => (
    postJson(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`, JSON.stringify({ tekst }))
);

export const fetchEgneKandidatlister = () => (
    fetchJson(`${KANDIDATLISTE_API}/me/kandidatlister`, true)
);

export const fetchKandidatlisteMedStillingsnr = (stillingsnummer) => (
    fetchJson(`${KANDIDATLISTE_API}/stilling/byNr/${stillingsnummer}/kandidatliste`, true)
);
