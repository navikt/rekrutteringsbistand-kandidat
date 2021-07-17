import { Kandidat, Kandidatstatus } from './kandidatlistetyper';
import { Retning } from '../common/sorterbarKolonneheader/Retning';
import { Utfall } from './kandidatrad/status-og-hendelser/etiketter/UtfallEtikett';

export enum KandidatSorteringsfelt {
    Navn,
    Fødselsnummer,
    LagtTilAv,
    LagtTilTidspunkt,
    StatusOgHendelser,
}

export type Kandidatsammenlikning = (k1: Kandidat, k2: Kandidat) => number;

const sorterAlfabetisk = (string1: string, string2: string, stigende: boolean) => {
    return stigende ? string1.localeCompare(string2, 'no') : string2.localeCompare(string1, 'no');
};

const sorterPåNavn = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.etternavn, k2.etternavn, retning === Retning.Stigende);
};

const sorterPåFnr = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    return sorterAlfabetisk(k1.fodselsnr || '', k2.fodselsnr || '', retning === Retning.Stigende);
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

const sorterPåHendelser = (k1: Kandidat, k2: Kandidat, retning: Retning) => {
    return (
        (retning === Retning.Synkende ? 1 : -1) *
        (hendelserIKronologiskRekkefølge.indexOf(k1.utfall) -
            hendelserIKronologiskRekkefølge.indexOf(k2.utfall))
    );
};

const sorterPåStatus = (k1: Kandidat, k2: Kandidat, retning: Retning) => {
    return (
        (retning === Retning.Synkende ? 1 : -1) *
        (statuserIKronologiskRekkefølge.indexOf(k1.status) -
            statuserIKronologiskRekkefølge.indexOf(k2.status))
    );
};

const sorterPåStatusOgHendelser = (retning: Retning): Kandidatsammenlikning => (k1, k2) => {
    return k1.utfall === k2.utfall
        ? sorterPåStatus(k1, k2, retning)
        : sorterPåHendelser(k1, k2, retning);
};

const statuserIKronologiskRekkefølge: Array<Kandidatstatus> = [
    Kandidatstatus.Uaktuell,
    Kandidatstatus.Uinteressert,
    Kandidatstatus.Vurderes,
    Kandidatstatus.Kontaktet,
    Kandidatstatus.Aktuell,
    Kandidatstatus.TilIntervju,
];

const hendelserIKronologiskRekkefølge: Array<Utfall> = [
    Utfall.IkkePresentert,
    Utfall.Presentert,
    Utfall.FåttJobben,
];

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
    [KandidatSorteringsfelt.LagtTilAv]: {
        [Retning.Stigende]: sorterPåLagtTilAv(Retning.Stigende),
        [Retning.Synkende]: sorterPåLagtTilAv(Retning.Synkende),
    },
    [KandidatSorteringsfelt.LagtTilTidspunkt]: {
        [Retning.Stigende]: sorterPåLagtTilTidspunkt(Retning.Stigende),
        [Retning.Synkende]: sorterPåLagtTilTidspunkt(Retning.Synkende),
    },
    [KandidatSorteringsfelt.StatusOgHendelser]: {
        [Retning.Stigende]: sorterPåStatusOgHendelser(Retning.Stigende),
        [Retning.Synkende]: sorterPåStatusOgHendelser(Retning.Synkende),
    },
};
