import { KandidatIKandidatliste } from './kandidatlistetyper';

export type Kandidatsortering = null | {
    algoritme: Sorteringsalgoritme;
    variant: Sorteringsvarianter;
};

export enum Sorteringsalgoritme {
    Navn,
    Fødselsnummer,
}

export enum Sorteringsvarianter {
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

export const sorteringsalgoritmer: Record<
    Sorteringsalgoritme,
    Record<Sorteringsvarianter, Kandidatsammenlikning>
> = {
    [Sorteringsalgoritme.Navn]: {
        [Sorteringsvarianter.Stigende]: sorterEtterNavn(),
        [Sorteringsvarianter.Synkende]: sorterEtterNavn(true),
    },
    [Sorteringsalgoritme.Fødselsnummer]: {
        [Sorteringsvarianter.Stigende]: sorterEtterFødselsnummer(),
        [Sorteringsvarianter.Synkende]: sorterEtterFødselsnummer(true),
    },
};
