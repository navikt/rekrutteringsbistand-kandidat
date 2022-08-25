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

export const lenkeTilAutomatiskMatching = (stillingsId: string) =>
    `/prototype/stilling/${stillingsId}`;

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

export const lenkeTilNyttKandidatsøk = (search?: string, kandidatlisteId?: string) => {
    let url = '/kandidatsok';

    if (search) {
        url += search;
    } else {
        url += '?';
    }

    if (kandidatlisteId) {
        url += `&kandidatliste=${kandidatlisteId}`;
    }

    return url;
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
    fraKandidatmatch?: boolean,
    fraNyttKandidatsøk?: boolean
) =>
    aktivFane === Kandidatfane.Cv
        ? lenkeTilCv(
              kandidatnr,
              kandidatlisteId,
              stillingsId,
              fraKandidatliste,
              fraKandidatmatch,
              fraNyttKandidatsøk
          )
        : lenkeTilHistorikk(
              kandidatnr,
              kandidatlisteId,
              stillingsId,
              fraKandidatliste,
              fraNyttKandidatsøk
          );

export const lenkeTilCv = (
    kandidatnr: string,
    kandidatlisteId?: string,
    stillingsId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean,
    fraNyttKandidatsøk?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/cv`;
    return (
        lenke +
        queryParamsForKandidatside(
            kandidatlisteId,
            stillingsId,
            fraKandidatliste,
            fraKandidatmatch,
            fraNyttKandidatsøk
        )
    );
};

export const lenkeTilHistorikk = (
    kandidatnr: string,
    kandidatlisteId?: string,
    stillingsId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean,
    fraNyttKandidatsøk?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/historikk`;
    return (
        lenke +
        queryParamsForKandidatside(
            kandidatlisteId,
            stillingsId,
            fraKandidatliste,
            fraKandidatmatch,
            fraNyttKandidatsøk
        )
    );
};

const queryParamsForKandidatside = (
    kandidatlisteId?: string,
    stillingsId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean,
    fraNyttKandidatsøk?: boolean
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
        queryParams +=
            nesteSeparator(queryParams) + `${KandidatQueryParam.FraAutomatiskMatching}=true`;
    }

    if (fraNyttKandidatsøk) {
        queryParams +=
            nesteSeparator(queryParams) + `${KandidatQueryParam.FraNyttKandidatsøk}=true`;
    }

    return queryParams;
};
