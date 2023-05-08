import { Kandidatstatus, Kandidatutfall, UsynligKandidat } from '../kandidatliste/domene/Kandidat';
import { Nettressurs, Nettstatus } from './Nettressurs';
import { deleteJsonMedType, deleteReq, fetchJson, postJson, putJson } from './fetchUtils';
import { Kandidatliste, Kandidatlistestatus } from '../kandidatliste/domene/Kandidatliste';
import { FormidlingAvUsynligKandidatOutboundDto } from '../felles/legg-til-kandidat-modal/LeggTilKandidatModal';
import { MineKandidatlister } from '../kandidatside/fraSøkUtenKontekst/lagre-kandidat-modal/useMineKandidatlister';
import { KandidatlisteDto } from '../kandidatlisteoversikt/modaler/Kandidatlisteskjema';
import Cv from '../cv/reducer/cv-typer';

export const ENHETSREGISTER_API = `/stilling-api/search-api`;
export const KANDIDATSOK_API = `/kandidat-api`;
export const SMS_API = `/sms-api`;
export const SYNLIGHET_API = `/synlighet-api`;

const convertToUrlParams = (query: object) =>
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

export function fetchCv(kandidatnr: string): Promise<Cv> {
    return fetchJson(
        `${KANDIDATSOK_API}/veileder/kandidatsok/hentcv?${convertToUrlParams({ kandidatnr })}`,
        true
    );
}

export const fetchKandidatlisteMedStillingsId = (stillingsId: string) =>
    fetchJson(`${KANDIDATSOK_API}/veileder/stilling/${stillingsId}/kandidatliste`, true);

export const fetchKandidatlisteMedKandidatlisteId = (kandidatlisteId: string) =>
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
    utfall: Kandidatutfall,
    navKontor: string,
    kandidatlisteId: string,
    kandidatnr: string
): Promise<Kandidatliste> =>
    putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater/${kandidatnr}/utfall`,
        JSON.stringify({ utfall, navKontor })
    );

export const postKandidatliste = (kandidatlisteDto: KandidatlisteDto) =>
    postJson(`${KANDIDATSOK_API}/veileder/me/kandidatlister`, JSON.stringify(kandidatlisteDto));

export function putKandidatliste(stillingsId) {
    return putJson(`${KANDIDATSOK_API}/veileder/stilling/${stillingsId}/kandidatliste/`);
}

export function endreKandidatliste(kandidatlisteId: string, kandidatlisteDto: KandidatlisteDto) {
    return putJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}`,
        JSON.stringify(kandidatlisteDto)
    );
}

export function fetchGeografiKode(geografiKode) {
    return fetchJson(`${KANDIDATSOK_API}/kodeverk/arenageografikoder/${geografiKode}`, true);
}

export const fetchStillingFraListe = (stillingsId) =>
    fetchJson(`${KANDIDATSOK_API}/kandidatsok/stilling/sokeord/${stillingsId}`, true);

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

export const postKandidatTilKandidatliste = async (
    kandidatlisteId: string,
    kandidatnr: string,
    notat?: string
): Promise<Nettressurs<Kandidatliste>> => {
    try {
        const body = await postJson(
            `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/kandidater`,
            JSON.stringify([
                {
                    kandidatnr,
                    notat,
                },
            ])
        );

        return {
            kind: Nettstatus.Suksess,
            data: body,
        };
    } catch (e) {
        return {
            kind: Nettstatus.Feil,
            error: e,
        };
    }
};

export const postFormidlingerAvUsynligKandidat = async (
    kandidatlisteId: string,
    dto: FormidlingAvUsynligKandidatOutboundDto
): Promise<Nettressurs<Kandidatliste>> => {
    try {
        const body = await postJson(
            `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/formidlingeravusynligkandidat`,
            JSON.stringify(dto)
        );

        return {
            kind: Nettstatus.Suksess,
            data: body,
        };
    } catch (e) {
        return {
            kind: Nettstatus.Feil,
            error: e,
        };
    }
};

export const putFormidlingsutfallForUsynligKandidat = (
    kandidatlisteId: string,
    formidlingId: string,
    utfall: Kandidatutfall,
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
        JSON.stringify({ arkivert })
    );
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

export const fetchMineKandidatlister = async (
    side: number,
    pageSize: number
): Promise<MineKandidatlister> =>
    await fetchJson(
        `${KANDIDATSOK_API}/veileder/kandidatlister?kunEgne=true&status=ÅPEN&pagesize=${pageSize}${
            side > 1 ? `&pagenumber=${side - 1}` : ''
        }`
    );

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

export const fetchUsynligKandidat = async (
    fnr: string
): Promise<Nettressurs<UsynligKandidat[]>> => {
    try {
        const body = await postJson(
            `${KANDIDATSOK_API}/veileder/kandidater/navn`,
            JSON.stringify({
                fnr,
            })
        );

        return {
            kind: Nettstatus.Suksess,
            data: body,
        };
    } catch (e) {
        return {
            kind: Nettstatus.Feil,
            error: e,
        };
    }
};

export const fetchArbeidsgivereEnhetsregister = (query) =>
    postJson(
        `${ENHETSREGISTER_API}/underenhet/_search`,
        JSON.stringify(employerNameCompletionQueryTemplate(query)),
        true
    );

export const fetchArbeidsgivereEnhetsregisterOrgnr = (orgnr) => {
    const query = orgnr.replace(/\s/g, '');
    return fetchJson(`${ENHETSREGISTER_API}/underenhet/_search?q=organisasjonsnummer:${query}*`);
};

export const markerKandidatlisteUtenStillingSomMin = (kandidatlisteId: string) =>
    putJson(`${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}/eierskap`);

export async function deleteKandidatliste(kandidatlisteId: string): Promise<Nettressurs<any>> {
    return await deleteJsonMedType<any>(
        `${KANDIDATSOK_API}/veileder/kandidatlister/${kandidatlisteId}`
    );
}

export const fetchSendteMeldinger = (kandidatlisteId: string) =>
    fetchJson(`${SMS_API}/${kandidatlisteId}`, true);

export const fetchSmserForKandidat = (fnr: string) => fetchJson(`${SMS_API}/fnr/${fnr}`, true);

export const postSmsTilKandidater = (melding: string, fnr: string[], kandidatlisteId: string) =>
    postJson(
        `${SMS_API}`,
        JSON.stringify({
            melding,
            fnr,
            kandidatlisteId,
        })
    );

export const fetchFerdigutfylteStillinger = () => {
    return fetchJson(`${KANDIDATSOK_API}/veileder/ferdigutfyltesok`, true);
};

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

export const slettCvFraArbeidsgiversKandidatliste = (
    kandidatlisteId: string,
    kandidatnummer: string,
    navKontor: string | null
): Promise<Kandidatliste> => {
    return putJson(
        `${KANDIDATSOK_API}/veileder/kandidat/arbeidsgiverliste/${kandidatlisteId}/${kandidatnummer}`,
        JSON.stringify({ navKontor })
    );
};
