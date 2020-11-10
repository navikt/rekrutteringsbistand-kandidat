import { KandidatIKandidatliste } from './kandidatlistetyper';

export enum Sorteringsalgoritme {
    Navn,
    Fødselsnummer,
    Status,
    Utfall,
}

export enum Sorteringsvariant {
    Stigende,
    Synkende,
}

export type Kandidatsammenlikning = (
    k1: KandidatIKandidatliste,
    k2: KandidatIKandidatliste
) => number;

const sorterAlfabetisk = (string1: string, string2: string, stigende: boolean) => {
    return stigende ? string1.localeCompare(string2, 'no') : string2.localeCompare(string1, 'no');
};

const sorterPåNavn = (variant: Sorteringsvariant): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.etternavn, k2.etternavn, variant === Sorteringsvariant.Stigende);
};

const sorterPåFnr = (variant: Sorteringsvariant): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(
        k1.fodselsnr || '',
        k2.fodselsnr || '',
        variant === Sorteringsvariant.Stigende
    );
};

const sorterPåStatus = (variant: Sorteringsvariant): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.status, k2.status, variant === Sorteringsvariant.Stigende);
};

const sorterPåUtfall = (variant: Sorteringsvariant): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.utfall, k2.utfall, variant === Sorteringsvariant.Stigende);
};

export const sorteringsalgoritmer: Record<
    Sorteringsalgoritme,
    Record<Sorteringsvariant, Kandidatsammenlikning>
> = {
    [Sorteringsalgoritme.Navn]: {
        [Sorteringsvariant.Stigende]: sorterPåNavn(Sorteringsvariant.Stigende),
        [Sorteringsvariant.Synkende]: sorterPåNavn(Sorteringsvariant.Synkende),
    },
    [Sorteringsalgoritme.Fødselsnummer]: {
        [Sorteringsvariant.Stigende]: sorterPåFnr(Sorteringsvariant.Stigende),
        [Sorteringsvariant.Synkende]: sorterPåFnr(Sorteringsvariant.Synkende),
    },
    [Sorteringsalgoritme.Status]: {
        [Sorteringsvariant.Stigende]: sorterPåStatus(Sorteringsvariant.Stigende),
        [Sorteringsvariant.Synkende]: sorterPåStatus(Sorteringsvariant.Synkende),
    },
    [Sorteringsalgoritme.Utfall]: {
        [Sorteringsvariant.Stigende]: sorterPåUtfall(Sorteringsvariant.Stigende),
        [Sorteringsvariant.Synkende]: sorterPåUtfall(Sorteringsvariant.Synkende),
    },
};
