import { KandidatIKandidatliste } from './kandidatlistetyper';

export type Kandidatsortering = null | {
    algoritme: Sorteringsalgoritme;
    variant: Sorteringsvarianter;
};

export enum Sorteringsalgoritme {
    Navn,
}

export enum Sorteringsvarianter {
    Stigende,
    Synkende,
}

export type Kandidatsammenlikning = (
    k1: KandidatIKandidatliste,
    k2: KandidatIKandidatliste
) => number;

export const sorterEtterNavn = (inverter?: boolean): Kandidatsammenlikning => (k1, k2) => {
    return inverter
        ? k2.etternavn.localeCompare(k1.etternavn, 'no')
        : k1.etternavn.localeCompare(k2.etternavn, 'no');
};

export const sorteringsalgoritmer: Record<
    Sorteringsalgoritme,
    Record<Sorteringsvarianter, Kandidatsammenlikning>
> = {
    [Sorteringsalgoritme.Navn]: {
        [Sorteringsvarianter.Stigende]: sorterEtterNavn(),
        [Sorteringsvarianter.Synkende]: sorterEtterNavn(true),
    },
};
