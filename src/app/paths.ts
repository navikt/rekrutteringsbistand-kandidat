import { KandidatQueryParam } from '../kandidatside/Kandidatside';

const nesteSeparator = (lenke: string) => (lenke.includes('?') ? '&' : '?');

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

export const lenkeTilKandidatsøk = (
    params?: string,
    stillingsId?: string,
    kandidatlisteId?: string
) => {
    if (stillingsId) {
        return lenkeTilFinnKandidaterMedStilling(stillingsId, params);
    } else if (kandidatlisteId) {
        return lenkeTilFinnKandidaterUtenStilling(kandidatlisteId, params);
    } else {
        return `/kandidater${params ? '?' + params : ''}`;
    }
};

export const lenkeTilFinnKandidaterMedStilling = (stillingsId: string, params?: string) =>
    `/kandidater/stilling/${stillingsId}${params ? '?' + params : ''}`;

export const lenkeTilFinnKandidaterUtenStilling = (stillingsId: string, params?: string) =>
    `/kandidater/kandidatliste/${stillingsId}${params ? '?' + params : ''}`;

export enum Kandidatfane {
    Cv,
    Historikk,
}

export const lenkeTilKandidatside = (
    kandidatnr: string,
    aktivFane: Kandidatfane,
    kandidatlisteId?: string,
    stillingsId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean
) =>
    aktivFane === Kandidatfane.Cv
        ? lenkeTilCv(kandidatnr, kandidatlisteId, stillingsId, fraKandidatliste, fraKandidatmatch)
        : lenkeTilHistorikk(kandidatnr, kandidatlisteId, stillingsId, fraKandidatliste);

export const lenkeTilCv = (
    kandidatnr: string,
    kandidatlisteId?: string,
    stillingsId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/cv`;
    return (
        lenke +
        queryParamsForKandidatside(kandidatlisteId, stillingsId, fraKandidatliste, fraKandidatmatch)
    );
};

export const lenkeTilHistorikk = (
    kandidatnr: string,
    kandidatlisteId?: string,
    stillingsId?: string,
    fraKandidatliste?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/historikk`;
    return lenke + queryParamsForKandidatside(kandidatlisteId, stillingsId, fraKandidatliste);
};

const queryParamsForKandidatside = (
    kandidatlisteId?: string,
    stillingsId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean
) => {
    let queryParams = '';

    if (kandidatlisteId) {
        queryParams +=
            nesteSeparator(queryParams) +
            `${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`;
    }

    if (stillingsId) {
        queryParams +=
            nesteSeparator(queryParams) + `${KandidatQueryParam.StillingId}=${stillingsId}`;
    }

    if (fraKandidatliste) {
        queryParams += nesteSeparator(queryParams) + `${KandidatQueryParam.FraKandidatliste}=true`;
    }

    if (fraKandidatmatch) {
        queryParams += nesteSeparator(queryParams) + `${KandidatQueryParam.FraKandidatmatch}=true`;
    }

    return queryParams;
};
