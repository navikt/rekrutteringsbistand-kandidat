/* eslint-disable no-underscore-dangle */

import {
    KANDIDATLISTE_API,
    SEARCH_API,
    ONTOLOGY_SEARCH_API_URL,
    ORGANISASJON_API,
    USE_JANZZ,
    SAMTYKKE_API,
    KODEVERK_API
} from '../common/fasitProperties';
import FEATURE_TOGGLES from '../../felles/konstanter';
import { KandidatlisteDetaljerResponse, Notat } from '../kandidatlisteDetaljer/kandidatlisteReducer';
import { ResponseData } from '../../felles/common/remoteData';
import {
    deleteJsonMedType,
    deleteReq,
    fetchJson,
    fetchJsonMedType,
    postJson,
    postJsonMedType,
    putJson,
    putJsonMedType
} from '../../felles/api';

const convertToUrlParams = (query) => Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
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

export function fetchKandidatliste(kandidatlisteId: string): Promise<ResponseData<KandidatlisteDetaljerResponse>> {
    return fetchJsonMedType<KandidatlisteDetaljerResponse>(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}`);
}

interface NotatResponse {
    liste: Array<Notat>,
    antallNotater: number
}

export async function fetchNotater(kandidatlisteId: string, kandidatnr: string): Promise<ResponseData<NotatResponse>> {
    return fetchJsonMedType<NotatResponse>(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`);
}

export async function postNotat(kandidatlisteId: string, kandidatnr: string, tekst: string): Promise<ResponseData<NotatResponse>> {
    return postJsonMedType<NotatResponse>(
        `${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`,
        JSON.stringify({ tekst })
    );
}

export async function putNotat(kandidatlisteId: string, kandidatnr: string, notat: Notat, tekst: string): Promise<ResponseData<NotatResponse>> {
    return putJsonMedType<NotatResponse>(
        `${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater/${notat.notatId}`,
        JSON.stringify({ tekst })
    );
}

export async function deleteNotat(kandidatlisteId: string, kandidatnr: string, notat: Notat): Promise<ResponseData<NotatResponse>> {
    return deleteJsonMedType<NotatResponse>(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater/${notat.notatId}`);
}

export async function deleteKandidater(kandidatlisteId: string, listeMedKandidatId: Array<string>): Promise<ResponseData<KandidatlisteDetaljerResponse>> {
    return await deleteJsonMedType<KandidatlisteDetaljerResponse>(`${KANDIDATLISTE_API}kandidatlister/${kandidatlisteId}/kandidater`, JSON.stringify(listeMedKandidatId));
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
