import { Nettressurs } from '../api/Nettressurs';
import { Tilgjengelighet } from '../kandidatside/cv/reducer/cv-typer';
import { Visningsstatus } from './Kandidatliste';
import { Utfall } from './kandidatrad/status-og-hendelser/etiketter/UtfallEtikett';
import { ForespørselOmDelingAvCv } from './knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

export enum SmsStatus {
    IkkeSendt = 'IKKE_SENDT',
    UnderUtsending = 'UNDER_UTSENDING',
    Sendt = 'SENDT',
    Feil = 'FEIL',
}

export interface Sms {
    id: number;
    fnr: string;
    opprettet: string;
    sendt: string;
    status: SmsStatus;
}

export enum Kandidatstatus {
    Vurderes = 'VURDERES',
    Kontaktet = 'KONTAKTET',
    Aktuell = 'AKTUELL',
    TilIntervju = 'TIL_INTERVJU',
    Uaktuell = 'UAKTUELL',
    Uinteressert = 'UINTERESSERT',
}

export interface Kandidat {
    kandidatId: string;
    kandidatnr: string;
    status: Kandidatstatus;
    lagtTilTidspunkt: string;
    lagtTilAv: LagtTilAv;
    fornavn: string;
    etternavn: string;
    epost: string | null;
    telefon: string | null;
    fodselsdato: string;
    fodselsnr: string | null;
    innsatsgruppe: string | null;
    utfall: Utfall;
    erSynlig: boolean;
    antallNotater: number;
    arkivert: boolean;
    arkivertTidspunkt: string | null;
    arkivertAv: string | null;
    aktørid: string | null;
    midlertidigUtilgjengeligStatus: Tilgjengelighet;
}

export const erInaktiv = (kandidat: Kandidat): boolean => kandidat.fodselsnr === null;

export const erKobletTilStilling = (
    kandidatliste: Kandidatliste | KandidatlisteSammendrag
): boolean => kandidatliste.stillingId !== null;

export const erKobletTilArbeidsgiver = (kandidatliste: Kandidatliste): boolean =>
    kandidatliste.organisasjonReferanse !== null;

export type LagtTilAv = {
    ident: string;
    navn: string;
};

export interface FormidlingAvUsynligKandidat {
    id: string;
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    utfall: Utfall;
    lagtTilTidspunkt: string;
    lagtTilAvIdent: string;
    lagtTilAvNavn: string;
    arkivert: boolean;
    arkivertAvIdent: string | null;
    arkivertAvNavn: string | null;
    arkivertTidspunkt: string | null;
}

export interface Notat {
    tekst: string;
    notatId: string;
    lagtTilTidspunkt: string;
    notatEndret: boolean;
    kanEditere: boolean;
    lagtTilAv: {
        navn: string;
        ident: string;
    };
}

export type OpprettetAv = {
    ident: string;
    navn: string;
};

export enum Kandidatlistestatus {
    Åpen = 'ÅPEN',
    Lukket = 'LUKKET',
}

export type Kandidatliste = {
    kandidatlisteId: string;
    tittel: string;
    beskrivelse: string;
    organisasjonReferanse: string | null;
    organisasjonNavn: string | null;
    stillingId: string | null;
    opprettetAv: OpprettetAv;
    opprettetTidspunkt: string;
    kanEditere: boolean;
    kanSlette: string;
    kandidater: Array<Kandidat>;
    formidlingerAvUsynligKandidat: Array<FormidlingAvUsynligKandidat>;
    status: Kandidatlistestatus;
    antallStillinger: number | null;
};

export type KandidatlisteSammendrag = {
    kandidatlisteId: string;
    tittel: string;
    beskrivelse: string;
    organisasjonReferanse: string | null;
    organisasjonNavn: string | null;
    stillingId: string | null;
    opprettetAv: OpprettetAv;
    opprettetTidspunkt: string;
    kanEditere: boolean;
    kanSlette: string;
    antallKandidater: number;
    antallUsynligeKandidater: number;
    status: Kandidatlistestatus;
    antallStillinger: number | null;
};

export type Kandidattilstand = {
    markert: boolean;
    filtrertBort: boolean;
    visningsstatus: Visningsstatus;
};

type Kandidatnr = string;

export type Kandidattilstander = Record<Kandidatnr, Kandidattilstand>;
export type Kandidatnotater = Record<Kandidatnr, Nettressurs<Notat[]>>;

export type KandidatIKandidatliste = Kandidat & {
    tilstand: Kandidattilstand;
    notater: Nettressurs<Notat[]>;
    sms?: Sms;
    forespørselOmDelingAvCv?: ForespørselOmDelingAvCv;
};

export type Kandidatlistefilter = {
    visArkiverte: boolean;
    status: Record<Kandidatstatus, boolean>;
    utfall: Record<Utfall, boolean>;
    navn: string;
};

export type Navn = {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
};
