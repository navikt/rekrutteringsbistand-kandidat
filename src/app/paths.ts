import { KandidatQueryParam } from '../kandidatside/Kandidatside';

const nesteSeparator = (lenke: string) => (lenke.includes('?') ? '&' : '?');

export const lenkeTilTilgangsside = `/kandidater/mangler-tilgang`;

export const lenkeTilKandidatlisteoversikt = `/kandidater/lister`;

export const lenkeTilKandidatliste = (kandidatlisteId: string, filterQuery?: URLSearchParams) => {
    let lenke = `/kandidater/lister/detaljer/${kandidatlisteId}`;

    if (filterQuery) {
        lenke += `?${filterQuery}`;
    }

    return lenke;
};

export const lenkeTilKandidat = (
    kandidatnummer: string,
    kandidatlisteId?: string,
    stillingsId?: string
) => {
    const path = `/kandidater/kandidat/${kandidatnummer}/cv`;
    if (kandidatlisteId) return path + `?${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`;
    if (stillingsId) return path + `?${KandidatQueryParam.StillingId}=${stillingsId}`;

    return path;
};

export const lenkeTilStilling = (stillingsId: string, redigeringsmodus?: boolean) =>
    `/stillinger/stilling/${stillingsId}${redigeringsmodus ? '?redigeringsmodus=true' : ''}`;

export const lenkeTilKandidatsøk = (searchParams?: string) => {
    let url = '/kandidatsok';

    if (searchParams) {
        url += '?' + searchParams;
    }

    return url;
};

export const lenkeTilFinnKandidater = (
    stillingId: string | null,
    kandidatlisteId: string,
    brukKriterierFraStillingen: boolean
) => {
    const brukKriterierFraStillingSuffiks = brukKriterierFraStillingen
        ? '&brukKriterierFraStillingen=true'
        : '';
    return `/kandidatsok?kandidatliste=${kandidatlisteId}${brukKriterierFraStillingSuffiks}`;
};

export const lenkeTilFinnKandidaterMedStilling = (stillingsId: string, params?: string) =>
    `/kandidater/stilling/${stillingsId}${params ? '?' + params : ''}`;

export const lenkeTilFinnKandidaterUtenStilling = (stillingsId: string, params?: string) =>
    `/kandidater/kandidatliste/${stillingsId}${params ? '?' + params : ''}`;

export const lenkeTilFinnKandidaterIKandidatsøk = (kandidatlisteId: string) =>
    `/kandidatsok?kandidatliste=${kandidatlisteId}`;

export enum Kandidatfane {
    Cv = 'cv',
    Historikk = 'historikk',
}

export const lenkeTilKandidatside = (
    kandidatnr: string,
    aktivFane: Kandidatfane,
    kandidatlisteId?: string,
    fraKandidatliste?: boolean,
    fraKandidatsøk?: boolean
) =>
    aktivFane === Kandidatfane.Cv
        ? lenkeTilCv(kandidatnr, kandidatlisteId, fraKandidatliste, fraKandidatsøk)
        : lenkeTilHistorikk(kandidatnr, kandidatlisteId, fraKandidatliste, fraKandidatsøk);

export const lenkeTilCv = (
    kandidatnr: string,
    kandidatlisteId?: string,
    fraKandidatliste?: boolean,
    fraKandidatsøk?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/cv`;
    return lenke + queryParamsForKandidatside(kandidatlisteId, fraKandidatliste, fraKandidatsøk);
};

export const lenkeTilHistorikk = (
    kandidatnr: string,
    kandidatlisteId?: string,
    fraKandidatliste?: boolean,
    fraKandidatsøk?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/historikk`;
    return lenke + queryParamsForKandidatside(kandidatlisteId, fraKandidatliste, fraKandidatsøk);
};

const queryParamsForKandidatside = (
    kandidatlisteId?: string,
    fraKandidatliste?: boolean,
    fraKandidatsøk?: boolean
) => {
    let queryParams = '';

    if (fraKandidatliste) {
        queryParams += nesteSeparator(queryParams) + `${KandidatQueryParam.FraKandidatliste}=true`;
    }

    if (fraKandidatsøk) {
        queryParams += nesteSeparator(queryParams) + `${KandidatQueryParam.FraKandidatsøk}=true`;
    }

    if (kandidatlisteId) {
        queryParams +=
            nesteSeparator(queryParams) +
            `${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`;
    }

    return queryParams;
};
