import { KandidatIKandidatliste } from './kandidatlistetyper';

export type Kandidatsortering = null | {
    algoritme: Sorteringsalgoritme;
    variant: Sorteringsvariant;
};

export enum Sorteringsalgoritme {
    Navn,
    Fødselsnummer,
    Status,
}

export enum Sorteringsvariant {
    Stigende,
    Synkende,
}

export type Kandidatsammenlikning = (
    k1: KandidatIKandidatliste,
    k2: KandidatIKandidatliste
) => number;

const sorterEtterNavn = (synkende?: boolean): Kandidatsammenlikning => (k1, k2) => {
    return synkende
        ? k2.etternavn.localeCompare(k1.etternavn, 'no')
        : k1.etternavn.localeCompare(k2.etternavn, 'no');
};

const sorterEtterFødselsnummer = (synkende?: boolean): Kandidatsammenlikning => (k1, k2) => {
    return synkende
        ? k2.fodselsnr.localeCompare(k1.fodselsnr, 'no')
        : k1.fodselsnr.localeCompare(k2.fodselsnr, 'no');
};

const sorterEtterStatus = (synkende?: boolean): Kandidatsammenlikning => (k1, k2) => {
    return synkende
        ? k2.status.localeCompare(k1.status, 'no')
        : k1.status.localeCompare(k2.status, 'no');
};

export const sorteringsalgoritmer: Record<
    Sorteringsalgoritme,
    Record<Sorteringsvariant, Kandidatsammenlikning>
> = {
    [Sorteringsalgoritme.Navn]: {
        [Sorteringsvariant.Stigende]: sorterEtterNavn(),
        [Sorteringsvariant.Synkende]: sorterEtterNavn(true),
    },
    [Sorteringsalgoritme.Fødselsnummer]: {
        [Sorteringsvariant.Stigende]: sorterEtterFødselsnummer(),
        [Sorteringsvariant.Synkende]: sorterEtterFødselsnummer(true),
    },
    [Sorteringsalgoritme.Status]: {
        [Sorteringsvariant.Stigende]: sorterEtterStatus(),
        [Sorteringsvariant.Synkende]: sorterEtterStatus(true),
    },
};
