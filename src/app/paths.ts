import { KandidatQueryParam } from '../kandidatside/Kandidatside';

const nesteSeparator = (lenke: string) => (lenke.includes('?') ? '&' : '?');

export const appPrefiks = '';

export const lenkeTilKandidatlisteoversikt = `${appPrefiks}/kandidater/lister`;

export const lenkeTilKandidatliste = (kandidatlisteId: string, filterQuery?: URLSearchParams) => {
    let lenke = `${appPrefiks}/kandidater/lister/detaljer/${kandidatlisteId}`;

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
    const path = `${appPrefiks}/kandidater/kandidat/${kandidatnummer}/cv`;
    if (kandidatlisteId) return path + `?${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`;
    if (stillingsId) return path + `?${KandidatQueryParam.StillingId}=${stillingsId}`;

    return path;
};

export const lenkeTilStilling = (stillingsId: string, redigeringsmodus?: boolean) =>
    `${appPrefiks}/stillinger/stilling/${stillingsId}${
        redigeringsmodus ? '?redigeringsmodus=true' : ''
    }`;

export const lenkeTilKandidatsøk = (params?: string) =>
    `${appPrefiks}/kandidater${params ? '?' + params : ''}`;

export const lenkeTilFinnKandidaterMedStilling = (stillingsId: string, params?: string) =>
    `${appPrefiks}/kandidater/stilling/${stillingsId}${params ? '?' + params : ''}`;

export const lenkeTilFinnKandidaterUtenStilling = (stillingsId: string, params?: string) =>
    `${appPrefiks}/kandidater/kandidatliste/${stillingsId}${params ? '?' + params : ''}`;

export const lenkeTilCv = (
    kandidatnr: string,
    kandidatlisteId?: string,
    stillingsId?: string,
    fraKandidatliste?: boolean
) => {
    let lenke = `${appPrefiks}/kandidater/kandidat/${kandidatnr}/cv`;

    if (kandidatlisteId) {
        lenke += nesteSeparator(lenke) + `${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`;
    }

    if (stillingsId) {
        lenke += nesteSeparator(lenke) + `${KandidatQueryParam.StillingId}=${stillingsId}`;
    }

    if (fraKandidatliste) {
        lenke += nesteSeparator(lenke) + `${KandidatQueryParam.FraKandidatliste}=true`;
    }

    return lenke;
};
