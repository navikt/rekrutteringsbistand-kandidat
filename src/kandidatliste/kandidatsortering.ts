import { Kandidatstatus } from './domene/Kandidat';
import { Retning } from './liste-header/sorterbarKolonneheader/Retning';
import {
    Hendelse,
    hentKandidatensSisteHendelse,
} from './kandidatrad/status-og-hendelser/etiketter/Hendelsesetikett';
import { KandidatMedForespørsel } from './hooks/useSorterteKandidater';

export enum KandidatSorteringsfelt {
    Navn,
    Fødselsnummer,
    LagtTilAv,
    LagtTilTidspunkt,
    StatusOgHendelser,
}

type Kandidatsammenlikning = (k1: KandidatMedForespørsel, k2: KandidatMedForespørsel) => number;

const sorterAlfabetisk = (string1: string, string2: string, stigende: boolean) => {
    return stigende ? string1.localeCompare(string2, 'no') : string2.localeCompare(string1, 'no');
};

const sorterPåNavn =
    (retning: Retning): Kandidatsammenlikning =>
    (k1, k2) => {
        return sorterAlfabetisk(
            k1.kandidat.etternavn,
            k2.kandidat.etternavn,
            retning === Retning.Stigende
        );
    };

const sorterPåFnr =
    (retning: Retning): Kandidatsammenlikning =>
    (k1, k2) => {
        return sorterAlfabetisk(
            k1.kandidat.fodselsnr || '',
            k2.kandidat.fodselsnr || '',
            retning === Retning.Stigende
        );
    };

const sorterPåLagtTilAv =
    (retning: Retning): Kandidatsammenlikning =>
    (k1, k2) => {
        return sorterAlfabetisk(
            k1.kandidat.lagtTilAv.navn,
            k2.kandidat.lagtTilAv.navn,
            retning === Retning.Stigende
        );
    };

const sorterPåLagtTilTidspunkt =
    (retning: Retning): Kandidatsammenlikning =>
    (k1, k2) => {
        const dato1 = Number(new Date(k1.kandidat.lagtTilTidspunkt)),
            dato2 = Number(new Date(k2.kandidat.lagtTilTidspunkt));

        if (dato1 - dato2 === 0) {
            return 0;
        }

        if (retning === Retning.Stigende) {
            return dato1 - dato2 < 0 ? +1 : -1;
        } else {
            return dato2 - dato1 < 0 ? +1 : -1;
        }
    };

const sorterPåHendelser = (
    k1: KandidatMedForespørsel,
    k2: KandidatMedForespørsel,
    retning: Retning
) => {
    const hendelse1 = hentKandidatensSisteHendelse(
        k1.kandidat.utfall,
        k1.kandidat.utfallsendringer,
        k1.forespørselOmDelingAvCv
    );
    const hendelse2 = hentKandidatensSisteHendelse(
        k2.kandidat.utfall,
        k2.kandidat.utfallsendringer,
        k2.forespørselOmDelingAvCv
    );

    return (
        (retning === Retning.Synkende ? 1 : -1) *
        (hendelserIKronologiskRekkefølge.indexOf(hendelse1) -
            hendelserIKronologiskRekkefølge.indexOf(hendelse2))
    );
};

const sorterPåStatus = (
    k1: KandidatMedForespørsel,
    k2: KandidatMedForespørsel,
    retning: Retning
) => {
    return (
        (retning === Retning.Synkende ? 1 : -1) *
        (statuserIKronologiskRekkefølge.indexOf(k1.kandidat.status) -
            statuserIKronologiskRekkefølge.indexOf(k2.kandidat.status))
    );
};

const sorterPåStatusOgHendelser =
    (retning: Retning): Kandidatsammenlikning =>
    (k1, k2) => {
        const hendelse1 = hentKandidatensSisteHendelse(
            k1.kandidat.utfall,
            k1.kandidat.utfallsendringer,
            k1.forespørselOmDelingAvCv
        );
        const hendelse2 = hentKandidatensSisteHendelse(
            k2.kandidat.utfall,
            k2.kandidat.utfallsendringer,
            k2.forespørselOmDelingAvCv
        );

        return hendelse1 === hendelse2
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

export const hendelserIKronologiskRekkefølge: Array<Hendelse> = [
    Hendelse.NyKandidat,
    Hendelse.DeltMedKandidat,
    Hendelse.SvarNei,
    Hendelse.SvarJa,
    Hendelse.CvDelt,
    Hendelse.FåttJobben,
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
