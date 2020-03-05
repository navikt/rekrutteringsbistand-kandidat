/* eslint-disable no-underscore-dangle */

import {
    SEARCH_API,
    KANDIDATSOK_API,
    KANDIDATLISTE_API,
    KODEVERK_API,
    PAM_SEARCH_API_GATEWAY_URL,
} from './common/fasitProperties';
import FEATURE_TOGGLES from './../felles/konstanter';
import { ResponseData } from '../felles/common/remoteData';
import {
    createCallIdHeader,
    deleteJsonMedType,
    deleteReq,
    fetchJson,
    postJson,
    putJson,
} from '../felles/api';

declare const __MOCK_API__: boolean;
const appIsMocked = typeof __MOCK_API__ !== 'undefined' && __MOCK_API__;

if (appIsMocked) {
    require('./mock/api.ts');
}

const convertToUrlParams = query =>
    Object.keys(query)
        .map(key => {
            if (Array.isArray(query[key])) {
                const encodedKey = encodeURIComponent(key);
                return query[key]
                    .map(v => `${encodedKey}=${encodeURIComponent(v)}`)
                    .reduce((accumulator, current) => `${accumulator}&${current}`, '');
            } else {
                if (query[key]) {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
                }
            }
        })
        .join('&')
        .replace(/%20/g, '+');

const employerNameCompletionQueryTemplate = match => ({
    query: {
        match_phrase: {
            navn_ngram_completion: {
                query: match,
                slop: 5,
            },
        },
    },
    size: 50,
});

export async function fetchTypeaheadSuggestionsRest(query = {}) {
    const resultat = await fetch(`${SEARCH_API}/typeahead?${convertToUrlParams(query)}`, {
        credentials: 'include',
        headers: createCallIdHeader(),
    });
    return resultat.json();
}

export function fetchFeatureToggles() {
    return fetchJson(`${SEARCH_API}/toggles?feature=${FEATURE_TOGGLES.join(',')}`);
}

export const fetchInnloggetVeileder = () => fetchJson(`${KANDIDATSOK_API}/veileder/me`, true);

export function fetchKandidater(query = {}) {
    return fetchJson(`${SEARCH_API}/sok?${convertToUrlParams(query)}`, true);
}

export function fetchKandidaterES(query = {}) {
    return fetchJson(`${SEARCH_API}/sok?${convertToUrlParams(query)}`, true);
}

export function fetchCv(arenaKandidatnr) {
    return fetchJson(`${SEARCH_API}/hentcv?${convertToUrlParams(arenaKandidatnr)}`, true);
}

export const fetchKandidatlisteMedStillingsId = stillingsId =>
    fetchJson(`${KANDIDATLISTE_API}/stilling/${stillingsId}/kandidatliste`, true);

export const fetchKandidatlisteMedKandidatlisteId = kandidatlisteId =>
    fetchJson(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}`, true);

export const putStatusKandidat = (status, kandidatlisteId, kandidatnr) =>
    putJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/status`,
        JSON.stringify({ status })
    );

export const postKandidatliste = kandidatlisteInfo =>
    postJson(`${KANDIDATLISTE_API}/me/kandidatlister`, JSON.stringify(kandidatlisteInfo));

export function putKandidatliste(stillingsId) {
    return putJson(`${KANDIDATLISTE_API}/stilling/${stillingsId}/kandidatliste/`);
}

export function putOppdaterKandidatliste(kandidatlisteBeskrivelse) {
    return putJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteBeskrivelse.kandidatlisteId}`,
        JSON.stringify(kandidatlisteBeskrivelse)
    );
}

export function fetchGeografiKode(geografiKode) {
    return fetchJson(`${KODEVERK_API}/arenageografikoder/${geografiKode}`, true);
}

export const fetchStillingFraListe = stillingsId =>
    fetchJson(`${KANDIDATSOK_API}/kandidatsok/stilling/sokeord/${stillingsId}`, true);

export const fetchKandidatMedFnr = fnr => fetchJson(`${SEARCH_API}/fnrsok/${fnr}`, true);

export const fetchNotater = (kandidatlisteId, kandidatnr) =>
    fetchJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`,
        true
    );

export const postDelteKandidater = (beskjed, mailadresser, kandidatlisteId, kandidatnummerListe) =>
    postJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/deltekandidater`,
        JSON.stringify({
            epostMottakere: mailadresser,
            epostTekst: beskjed,
            kandidater: kandidatnummerListe,
        })
    );

export const postKandidaterTilKandidatliste = (kandidatlisteId, kandidater) =>
    postJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater`,
        JSON.stringify(kandidater)
    );

export const postNotat = (kandidatlisteId, kandidatnr, tekst) =>
    postJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`,
        JSON.stringify({ tekst })
    );

export const putNotat = (kandidatlisteId, kandidatnr, notatId, tekst) =>
    putJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater/${notatId}/`,
        JSON.stringify({ tekst })
    );

export const deleteNotat = (kandidatlisteId, kandidatnr, notatId) =>
    deleteReq(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater/${notatId}/`
    );

export function putErSlettet(kandidatlisteId: string, kandidatNr: string, erSlettet: boolean) {
    return putJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatNr}/erSlettet`,
        JSON.stringify(erSlettet)
    );
}

export const fetchKandidatlister = (query = {}) =>
    fetchJson(`${KANDIDATLISTE_API}/kandidatlister?${convertToUrlParams(query)}`, true);

export const fetchKandidatlisteMedAnnonsenummer = annonsenummer =>
    fetchJson(`${KANDIDATLISTE_API}/stilling/byNr/${annonsenummer}/kandidatliste`, true);

export const fetchArbeidsgivereEnhetsregister = query =>
    postJson(
        `${PAM_SEARCH_API_GATEWAY_URL}/underenhet/_search`,
        JSON.stringify(employerNameCompletionQueryTemplate(query))
    );

export const fetchArbeidsgivereEnhetsregisterOrgnr = orgnr => {
    const query = orgnr.replace(/\s/g, '');
    return fetchJson(
        `${PAM_SEARCH_API_GATEWAY_URL}/underenhet/_search?q=organisasjonsnummer:${query}*`
    );
};

export const endreEierskapPaKandidatliste = kandidatlisteId =>
    putJson(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/eierskap`);

export async function deleteKandidatliste(kandidatlisteId: string): Promise<ResponseData<any>> {
    return await deleteJsonMedType<any>(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}`);
}
