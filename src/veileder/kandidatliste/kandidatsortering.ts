import { KandidatIKandidatliste } from './kandidatlistetyper';

export enum Sorteringsalgoritme {
    Navn,
    Fødselsnummer,
    Status,
    Utfall,
    LagtTilAv,
    LagtTilTidspunkt,
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

const sorterPåLagtTilAv = (variant: Sorteringsvariant): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(
        k1.lagtTilAv.navn,
        k2.lagtTilAv.navn,
        variant === Sorteringsvariant.Stigende
    );
};

const sorterPåLagtTilTidspunkt = (variant: Sorteringsvariant): Kandidatsammenlikning => (
    k1,
    k2
) => {
    const dato1 = Number(new Date(k1.lagtTilTidspunkt)),
        dato2 = Number(new Date(k2.lagtTilTidspunkt));

    if (dato1 - dato2 === 0) {
        return 0;
    }

    if (variant === Sorteringsvariant.Stigende) {
        return dato1 - dato2 < 0 ? +1 : -1;
    } else {
        return dato2 - dato1 < 0 ? +1 : -1;
    }
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
    [Sorteringsalgoritme.LagtTilAv]: {
        [Sorteringsvariant.Stigende]: sorterPåLagtTilAv(Sorteringsvariant.Stigende),
        [Sorteringsvariant.Synkende]: sorterPåLagtTilAv(Sorteringsvariant.Synkende),
    },
    [Sorteringsalgoritme.LagtTilTidspunkt]: {
        [Sorteringsvariant.Stigende]: sorterPåLagtTilTidspunkt(Sorteringsvariant.Stigende),
        [Sorteringsvariant.Synkende]: sorterPåLagtTilTidspunkt(Sorteringsvariant.Synkende),
    },
};
