import { Kandidatlistestatus, Kandidatstatus } from './kandidatliste/kandidatlistetyper';
/* eslint-disable no-underscore-dangle */

import {
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
import { Utfall } from './kandidatliste/kandidatrad/utfall-med-endre-ikon/UtfallMedEndreIkon';
import { Kandidatliste } from './kandidatliste/kandidatlistetyper';
import { FormidlingAvUsynligKandidatOutboundDto } from './kandidatliste/modaler/legg-til-kandidat-modal/LeggTilKandidatModal';

export const KANDIDATSOK_API = '/rekrutteringsbistand-kandidat/api';

if (process.env.REACT_APP_MOCK) {
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
    const resultat = await fetch(
        `${KANDIDATSOK_API}/veileder/kandidatsok/typeahead?${convertToUrlParams(query)}`,
        {
            credentials: 'include',
            headers: createCallIdHeader(),
        }
    );
    return resultat.json();
}

export function fetchFeatureToggles() {
    return fetchJson(
        `${KANDIDATSOK_API}/veileder/kandidatsok/toggles?feature=${FEATURE_TOGGLES.join(',')}`
    );
}

export function fetchKandidater(query = {}) {
    return fetchJson(
        `${KANDIDATSOK_API}/veileder/kandidatsok/sok?${convertToUrlParams(query)}`,
        true
    );
}

export function fetchKandidaterES(query = {}) {
    return fetchJson(
        `${KANDIDATSOK_API}/veileder/kandidatsok/sok?${convertToUrlParams(query)}`,
        true
    );
}

export function fetchCv(arenaKandidatnr) {
    return fetchJson(
        `${KANDIDATSOK_API}/veileder/kandidatsok/hentcv?${convertToUrlParams(arenaKandidatnr)}`,
        true
    );
}

export const fetchKandidatlisteMedStillingsId = (stillingsId) =>
    fetchJson(`${KANDIDATSOK_API}/veileder/stilling/${stillingsId}/kandidatliste`, true);

export const fetchKandidatlisteMedKandidatlisteId = (kandidatlisteId) =>
    fetchJson(`${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}`, true);

export const putStatusKandidat = (
    status: Kandidatstatus,
    kandidatlisteId: string,
    kandidatnr: string
): Promise<Kandidatliste> =>
    putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/status`,
        JSON.stringify({ status })
    );

export const putUtfallKandidat = (
    utfall: Utfall,
    navKontor: string,
    kandidatlisteId: string,
    kandidatnr: string
): Promise<Kandidatliste> =>
    putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/utfall`,
        JSON.stringify({ utfall, navKontor })
    );

export const postKandidatliste = (kandidatlisteInfo) =>
    postJson(`${KANDIDATSOK_API}/veileder/me/kandidatlister`, JSON.stringify(kandidatlisteInfo));

export function putKandidatliste(stillingsId) {
    return putJson(`${KANDIDATSOK_API}/veileder/stilling/${stillingsId}/kandidatliste/`);
}

export function putOppdaterKandidatliste(kandidatlisteBeskrivelse) {
    return putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteBeskrivelse.kandidatlisteId}`,
        JSON.stringify(kandidatlisteBeskrivelse)
    );
}

export function fetchGeografiKode(geografiKode) {
    return fetchJson(`${KANDIDATSOK_API}/kodeverk/arenageografikoder/${geografiKode}`, true);
}

export const fetchStillingFraListe = (stillingsId) =>
    fetchJson(`${KANDIDATSOK_API}/kandidatsok/stilling/sokeord/${stillingsId}`, true);

export const fetchKandidatMedFnr = (fnr: string) =>
    postJson(`${KANDIDATSOK_API}/veileder/kandidatsok/fnrsok`, JSON.stringify({ fnr }));

export const fetchNotater = (kandidatlisteId, kandidatnr) =>
    fetchJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`,
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
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/deltekandidater`,
        JSON.stringify({
            epostMottakere: mailadresser,
            epostTekst: beskjed,
            kandidater: kandidatnummerListe,
            navKontor: navKontor,
        })
    );

export const postKandidaterTilKandidatliste = (kandidatlisteId, kandidater) =>
    postJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater`,
        JSON.stringify(kandidater)
    );

export const postFormidlingerAvUsynligKandidat = (
    kandidatlisteId: string,
    formidlingAvUsynligKandidat: FormidlingAvUsynligKandidatOutboundDto
) =>
    postJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/formidlingeravusynligkandidat`,
        JSON.stringify(formidlingAvUsynligKandidat)
    );

export const putFormidlingsutfallForUsynligKandidat = (
    kandidatlisteId: string,
    formidlingId: string,
    utfall: Utfall,
    navKontor: string
): Promise<Kandidatliste> =>
    putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/formidlingeravusynligkandidat/${formidlingId}/utfall`,
        JSON.stringify({ utfall, navKontor })
    );

export const postNotat = (kandidatlisteId, kandidatnr, tekst) =>
    postJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater`,
        JSON.stringify({ tekst })
    );

export const putNotat = (kandidatlisteId, kandidatnr, notatId, tekst) =>
    putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater/${notatId}/`,
        JSON.stringify({ tekst })
    );

export const deleteNotat = (kandidatlisteId, kandidatnr, notatId) =>
    deleteReq(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/notater/${notatId}/`
    );

export const putArkivert = (kandidatlisteId: string, kandidatNr: string, arkivert: boolean) => {
    return putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater/${kandidatNr}/arkivert`,
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
    fetchJson(`${KANDIDATSOK_API}/veileder/kandidatlister?${convertToUrlParams(query)}`, true);

export const fetchKandidatlisterForKandidat = (
    kandidatnr: string,
    inkluderSlettede?: boolean,
    filtrerPåStilling?: string
) => {
    return fetchJson(
        `${KANDIDATSOK_API}/veileder/kandidater/${kandidatnr}/listeoversikt?${convertToUrlParams({
            inkluderSlettede: 'true',
            filtrerPaaStilling: filtrerPåStilling,
        })}`,
        true
    );
};

export const fetchUsynligKandidat = (fodselsnummer: string) => {
    return postJson(
        `${KANDIDATSOK_API}/veileder/kandidater/navn`,
        JSON.stringify({
            fnr: fodselsnummer,
        })
    );
};

export const fetchKandidatlisteMedAnnonsenummer = (annonsenummer) =>
    fetchJson(`${KANDIDATSOK_API}/veileder/stilling/byNr/${annonsenummer}/kandidatliste`, true);

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
    putJson(`${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/eierskap`);

export async function deleteKandidatliste(kandidatlisteId: string): Promise<ResponseData<any>> {
    return await deleteJsonMedType<any>(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}`
    );
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

export const putKandidatlistestatus = (
    kandidatlisteId: string,
    status: Kandidatlistestatus
): Promise<Kandidatliste> => {
    return putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/status`,
        JSON.stringify({ status })
    );
};
