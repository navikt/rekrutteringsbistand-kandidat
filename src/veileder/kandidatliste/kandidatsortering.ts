import { KandidatIKandidatliste } from './kandidatlistetyper';
import { Retning } from '../common/sorterbarKolonneheader/Retning';

export enum KandidatSorteringsfelt {
    Navn = 'Navn',
    Fødselsnummer = 'Fødselsnummer',
    Status = 'Status',
    Utfall = 'Utfall',
    LagtTilAv = 'LagtTilAv',
    LagtTilTidspunkt = 'LagtTilTidspunkt',
}

export type Kandidatsammenlikning = (
    k1: KandidatIKandidatliste,
    k2: KandidatIKandidatliste
) => number;

const sorterAlfabetisk = (string1: string, string2: string, stigende: boolean) => {
    return stigende ? string1.localeCompare(string2, 'no') : string2.localeCompare(string1, 'no');
};

const sorterPåNavn = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.etternavn, k2.etternavn, retning === Retning.Stigende);
};

const sorterPåFnr = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.fodselsnr || '', k2.fodselsnr || '', retning === Retning.Stigende);
};

const sorterPåStatus = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.status, k2.status, retning === Retning.Stigende);
};

const sorterPåUtfall = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.utfall, k2.utfall, retning === Retning.Stigende);
};

const sorterPåLagtTilAv = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.lagtTilAv.navn, k2.lagtTilAv.navn, retning === Retning.Stigende);
};

const sorterPåLagtTilTidspunkt = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    const dato1 = Number(new Date(k1.lagtTilTidspunkt)),
        dato2 = Number(new Date(k2.lagtTilTidspunkt));

    if (dato1 - dato2 === 0) {
        return 0;
    }

    if (retning === Retning.Stigende) {
        return dato1 - dato2 < 0 ? +1 : -1;
    } else {
        return dato2 - dato1 < 0 ? +1 : -1;
    }
};

export const sorteringsalgoritmer: Record<
    KandidatSorteringsfelt,
    Record<Retning, Kandidatsammenlikning>
> = {
    [KandidatSorteringsfelt.Navn]: {
        [Retning.Stigende]: sorterPåNavn(Retning.Stigende),
        [Retning.Synkende]: sorterPåNavn(Retning.Synkende),
    },
    [KandidatSorteringsfelt.Fødselsnummer]: {
        [Retning.Stigende]: sorterPåFnr(Retning.Stigende),
        [Retning.Synkende]: sorterPåFnr(Retning.Synkende),
    },
    [KandidatSorteringsfelt.Status]: {
        [Retning.Stigende]: sorterPåStatus(Retning.Stigende),
        [Retning.Synkende]: sorterPåStatus(Retning.Synkende),
    },
    [KandidatSorteringsfelt.Utfall]: {
        [Retning.Stigende]: sorterPåUtfall(Retning.Stigende),
        [Retning.Synkende]: sorterPåUtfall(Retning.Synkende),
    },
    [KandidatSorteringsfelt.LagtTilAv]: {
        [Retning.Stigende]: sorterPåLagtTilAv(Retning.Stigende),
        [Retning.Synkende]: sorterPåLagtTilAv(Retning.Synkende),
    },
    [KandidatSorteringsfelt.LagtTilTidspunkt]: {
        [Retning.Stigende]: sorterPåLagtTilTidspunkt(Retning.Stigende),
        [Retning.Synkende]: sorterPåLagtTilTidspunkt(Retning.Synkende),
    },
};
