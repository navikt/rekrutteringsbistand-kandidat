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

export const lenkeTilNyttKandidatsøk = (searchParams?: string) => {
    let url = '/kandidatsok';

    if (searchParams) {
        url += '?' + searchParams;
    }

    return url;
};

export const lenkeTilFinnKandidater = (stillingId: string | null, kandidatlisteId: string) => {
    return lenkeTilFinnKandidaterINyttKandidatsøk(kandidatlisteId);
};

export const lenkeTilFinnKandidaterMedStilling = (stillingsId: string, params?: string) =>
    `/kandidater/stilling/${stillingsId}${params ? '?' + params : ''}`;

export const lenkeTilFinnKandidaterUtenStilling = (stillingsId: string, params?: string) =>
    `/kandidater/kandidatliste/${stillingsId}${params ? '?' + params : ''}`;

export const lenkeTilFinnKandidaterINyttKandidatsøk = (kandidatlisteId: string) =>
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
    fraKandidatmatch?: boolean,
    fraNyttKandidatsøk?: boolean
) =>
    aktivFane === Kandidatfane.Cv
        ? lenkeTilCv(
              kandidatnr,
              kandidatlisteId,
              fraKandidatliste,
              fraKandidatmatch,
              fraNyttKandidatsøk
          )
        : lenkeTilHistorikk(
              kandidatnr,
              kandidatlisteId,
              fraKandidatliste,
              fraKandidatmatch,
              fraNyttKandidatsøk
          );

export const lenkeTilCv = (
    kandidatnr: string,
    kandidatlisteId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean,
    fraNyttKandidatsøk?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/cv`;
    return (
        lenke +
        queryParamsForKandidatside(
            kandidatlisteId,
            fraKandidatliste,
            fraKandidatmatch,
            fraNyttKandidatsøk
        )
    );
};

export const lenkeTilHistorikk = (
    kandidatnr: string,
    kandidatlisteId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean,
    fraNyttKandidatsøk?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/historikk`;
    return (
        lenke +
        queryParamsForKandidatside(
            kandidatlisteId,
            fraKandidatliste,
            fraKandidatmatch,
            fraNyttKandidatsøk
        )
    );
};

const queryParamsForKandidatside = (
    kandidatlisteId?: string,
    fraKandidatliste?: boolean,
    fraKandidatmatch?: boolean,
    fraNyttKandidatsøk?: boolean
) => {
    let queryParams = '';

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

    if (kandidatlisteId) {
        queryParams +=
            nesteSeparator(queryParams) +
            `${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`;
    }

    return queryParams;
};
