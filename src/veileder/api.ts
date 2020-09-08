import { Status } from './kandidatliste/kandidatrad/statusSelect/StatusSelect';
/* eslint-disable no-underscore-dangle */

import {
    SEARCH_API,
    KANDIDATSOK_API,
    KANDIDATLISTE_API,
    KODEVERK_API,
    PAM_SEARCH_API_GATEWAY_URL,
    MIDLERTIDIG_UTILGJENGELIG_PROXY,
    SMS_PROXY,
} from './common/fasitProperties';
import FEATURE_TOGGLES from './../felles/konstanter';
import { ResponseData } from '../felles/common/remoteData';
import {
    createCallIdHeader,
    deleteJsonMedType,
    deleteReq,
    deleteWithoutJson,
    fetchJson,
    postJson,
    putJson,
} from '../felles/api';
import { FerdigutfylteStillingerKlikk } from './result/viktigeyrker/Bransje';
import { Utfall } from './kandidatliste/kandidatrad/utfall-select/UtfallSelect';
import { Kandidatliste } from './kandidatliste/kandidatlistetyper';
import { FormidlingAvUsynligKandidatOutboundDto } from './kandidatliste/modaler/legg-til-kandidat-modal/LeggTilKandidatModal';

declare const __MOCK_API__: boolean;
const appIsMocked = typeof __MOCK_API__ !== 'undefined' && __MOCK_API__;

if (appIsMocked) {
    require('./mock/api.ts');
}

const convertToUrlParams = (query) =>
    Object.keys(query)
        .map((key) => {
            if (Array.isArray(query[key])) {
                const encodedKey = encodeURIComponent(key);
                return query[key]
                    .map((v) => `${encodedKey}=${encodeURIComponent(v)}`)
                    .reduce((accumulator, current) => `${accumulator}&${current}`, '');
            } else {
                if (query[key]) {
                    return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
                }
            }

            return '';
        })
        .join('&')
        .replace(/%20/g, '+');

const employerNameCompletionQueryTemplate = (match) => ({
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

export function fetchKandidater(query = {}) {
    return fetchJson(`${SEARCH_API}/sok?${convertToUrlParams(query)}`, true);
}

export function fetchKandidaterES(query = {}) {
    return fetchJson(`${SEARCH_API}/sok?${convertToUrlParams(query)}`, true);
}

export function fetchCv(arenaKandidatnr) {
    return fetchJson(`${SEARCH_API}/hentcv?${convertToUrlParams(arenaKandidatnr)}`, true);
}

export const fetchKandidatlisteMedStillingsId = (stillingsId) =>
    fetchJson(`${KANDIDATLISTE_API}/stilling/${stillingsId}/kandidatliste`, true);

export const fetchKandidatlisteMedKandidatlisteId = (kandidatlisteId) =>
    fetchJson(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}`, true);

export const putStatusKandidat = (
    status: Status,
    kandidatlisteId: string,
    kandidatnr: string
): Promise<Kandidatliste> =>
    putJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/status`,
        JSON.stringify({ status })
    );

export const putUtfallKandidat = (
    utfall: Utfall,
    navKontor: string,
    kandidatlisteId: string,
    kandidatnr: string
): Promise<Kandidatliste> =>
    putJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/utfall`,
        JSON.stringify({ utfall, navKontor })
    );

export const postKandidatliste = (kandidatlisteInfo) =>
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

export const fetchStillingFraListe = (stillingsId) =>
    fetchJson(`${KANDIDATSOK_API}/kandidatsok/stilling/sokeord/${stillingsId}`, true);

export const fetchKandidatMedFnr = (fnr) => fetchJson(`${SEARCH_API}/fnrsok/${fnr}`, true);

export const fetchNotater = (kandidatlisteId, kandidatnr) =>
    fetchJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`,
        true
    );

export const postDelteKandidater = (
    beskjed,
    mailadresser,
    kandidatlisteId,
    kandidatnummerListe,
    navKontor
) =>
    postJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/deltekandidater`,
        JSON.stringify({
            epostMottakere: mailadresser,
            epostTekst: beskjed,
            kandidater: kandidatnummerListe,
            navKontor: navKontor,
        })
    );

export const postKandidaterTilKandidatliste = (kandidatlisteId, kandidater) =>
    postJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater`,
        JSON.stringify(kandidater)
    );

export const postFormidlingerAvUsynligKandidat = (
    kandidatlisteId: string,
    formidlingAvUsynligKandidat: FormidlingAvUsynligKandidatOutboundDto
) =>
    postJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/formidlingeravusynligkandidat`,
        JSON.stringify(formidlingAvUsynligKandidat)
    );

export const putFormidlingsutfallForUsynligKandidat = (
    kandidatlisteId: string,
    formidlingId: string,
    utfall: Utfall,
    navKontor: string
): Promise<Kandidatliste> =>
    putJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/formidlingeravusynligkandidat/${formidlingId}/utfall`,
        JSON.stringify({ utfall, navKontor })
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

export const putArkivert = (kandidatlisteId: string, kandidatNr: string, arkivert: boolean) => {
    return putJson(
        `${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/kandidater/${kandidatNr}/arkivert`,
        JSON.stringify(arkivert)
    );
};

export const fetchMidlertidigUtilgjengelig = (aktørId: string) => {
    return fetchJson(`${MIDLERTIDIG_UTILGJENGELIG_PROXY}/${aktørId}`, true);
};

export const postMidlertidigUtilgjengelig = (aktørId: string, tilDato: string) => {
    return postJson(
        `${MIDLERTIDIG_UTILGJENGELIG_PROXY}`,
        JSON.stringify({
            aktørId,
            tilDato,
        })
    );
};

export const putMidlertidigUtilgjengelig = (aktørId: string, tilDato: string) => {
    return putJson(
        `${MIDLERTIDIG_UTILGJENGELIG_PROXY}/${aktørId}`,
        JSON.stringify({ aktørId, tilDato })
    );
};

export const deleteMidlertidigUtilgjengelig = (aktørId: string) => {
    return deleteWithoutJson(`${MIDLERTIDIG_UTILGJENGELIG_PROXY}/${aktørId}`);
};

export const putArkivertForFlereKandidater = (
    kandidatlisteId: string,
    kandidatnumre: string[],
    arkivert: boolean
): Promise<Array<string | null>> => {
    return Promise.all(
        kandidatnumre.map((kandidatNr) =>
            putArkivert(kandidatlisteId, kandidatNr, arkivert)
                .then((kandidat) => kandidat.kandidatnr)
                .catch(() => null)
        )
    );
};

export const fetchKandidatlister = (query = {}) =>
    fetchJson(`${KANDIDATLISTE_API}/kandidatlister?${convertToUrlParams(query)}`, true);

export const fetchKandidatlisterForKandidat = (
    kandidatnr: string,
    inkluderSlettede?: boolean,
    filtrerPåStilling?: string
) => {
    return fetchJson(
        `${KANDIDATLISTE_API}/kandidater/${kandidatnr}/listeoversikt?${convertToUrlParams({
            inkluderSlettede: 'true',
            filtrerPaaStilling: filtrerPåStilling,
        })}`,
        true
    );
};

export const fetchUsynligKandidat = (fodselsnummer: string) => {
    return postJson(
        `${KANDIDATLISTE_API}/kandidater/navn`,
        JSON.stringify({
            fnr: fodselsnummer,
        })
    );
};

export const fetchKandidatlisteMedAnnonsenummer = (annonsenummer) =>
    fetchJson(`${KANDIDATLISTE_API}/stilling/byNr/${annonsenummer}/kandidatliste`, true);

export const fetchArbeidsgivereEnhetsregister = (query) =>
    postJson(
        `${PAM_SEARCH_API_GATEWAY_URL}/underenhet/_search`,
        JSON.stringify(employerNameCompletionQueryTemplate(query))
    );

export const fetchArbeidsgivereEnhetsregisterOrgnr = (orgnr) => {
    const query = orgnr.replace(/\s/g, '');
    return fetchJson(
        `${PAM_SEARCH_API_GATEWAY_URL}/underenhet/_search?q=organisasjonsnummer:${query}*`
    );
};

export const endreEierskapPaKandidatliste = (kandidatlisteId) =>
    putJson(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}/eierskap`);

export async function deleteKandidatliste(kandidatlisteId: string): Promise<ResponseData<any>> {
    return await deleteJsonMedType<any>(`${KANDIDATLISTE_API}/kandidatlister/${kandidatlisteId}`);
}

export const fetchSendteMeldinger = (kandidatlisteId: string) =>
    fetchJson(`${SMS_PROXY}/${kandidatlisteId}`, true);

export const postSmsTilKandidater = (melding: string, fnr: string[], kandidatlisteId: string) =>
    postJson(
        `${SMS_PROXY}`,
        JSON.stringify({
            melding,
            fnr,
            kandidatlisteId,
        })
    );

export const fetchFerdigutfylteStillinger = () => {
    return fetchJson(`${KANDIDATSOK_API}/veileder/ferdigutfyltesok`, true);
};

export const postFerdigutfylteStillingerKlikk = (
    ferdigutfylteStillingerKlikk: FerdigutfylteStillingerKlikk
) =>
    postJson(
        `${KANDIDATSOK_API}/veileder/ferdigutfyltesok/klikk`,
        JSON.stringify(ferdigutfylteStillingerKlikk)
    );

export const hentKandidatnr = (fnr: string): Promise<{ kandidatnr: string }> => {
    return postJson(`${KANDIDATSOK_API}/fnr-til-kandidatnr`, JSON.stringify({ fnr }));
};
