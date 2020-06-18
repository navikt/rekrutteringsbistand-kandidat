import { KandidatQueryParam } from './../kandidatside/Kandidatside';

const nesteSeparator = (lenke: string) => (lenke.includes('?') ? '&' : '?');

export const lenkeTilKandidatliste = (kandidatlisteId: string) =>
    `/kandidater/lister/detaljer/${kandidatlisteId}`;

export const lenkeTilStilling = (stillingsId: string) => `/stilling/${stillingsId}`;

export const lenkeTilCv = (
    kandidatnr: string,
    kandidatlisteId?: string,
    fraKandidatliste?: boolean
) => {
    let lenke = `/kandidater/kandidat/${kandidatnr}/cv`;

    if (kandidatlisteId) {
        lenke += nesteSeparator(lenke) + `${KandidatQueryParam.KandidatlisteId}=${kandidatlisteId}`;
    }

    if (fraKandidatliste) {
        lenke += nesteSeparator(lenke) + `${KandidatQueryParam.FraKandidatliste}=true`;
    }

    return lenke;
};
