export const lenkeTilKandidatliste = (kandidatlisteId: string) =>
    `/kandidater/lister/detaljer/${kandidatlisteId}`;

export const lenkeTilStilling = (stillingsId: string) => `/stilling/${stillingsId}`;

export const lenkeTilCv = (kandidatnr: string) => `/kandidater/kandidat/${kandidatnr}/cv`;
