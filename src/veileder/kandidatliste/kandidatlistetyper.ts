import { Utfall } from './kandidatrad/utfall-med-endre-ikon/UtfallMedEndreIkon';
import { RemoteData } from './../../felles/common/remoteData';
import { Visningsstatus } from './Kandidatliste';
import { Tilgjengelighet } from '../../veileder/sok/Søkeresultat';

export enum Delestatus {
    IkkeSpurt = 'IKKE_SPURT',
    Loading = 'LOADING',
    Success = 'SUCCESS',
}

export enum HentStatus {
    IkkeHentet = 'IKKE_HENTET',
    Loading = 'LOADING',
    Success = 'SUCCESS',
    FinnesIkke = 'FINNES_IKKE',
    Failure = 'FAILURE',
}

export enum SmsStatus {
    IkkeSendt = 'IKKE_SENDT',
    UnderUtsending = 'UNDER_UTSENDING',
    Sendt = 'SENDT',
    Feil = 'FEIL',
}

export enum MarkerSomMinStatus {
    IkkeGjort = 'IKKE_GJORT',
    Loading = 'LOADING',
    Success = 'SUCCESS',
    Failure = 'FAILURE',
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
    Uaktuell = 'UAKTUELL',
    Uinteressert = 'UINTERESSERT',
}

export interface Kandidat {
    kandidatId: string;
    kandidatnr: string;
    sisteArbeidserfaring: string;
    status: Kandidatstatus;
    lagtTilTidspunkt: string;
    lagtTilAv: {
        ident: string;
        navn: string;
    };
    fornavn: string;
    etternavn: string;
    epost?: string;
    telefon?: string;
    fodselsdato: string;
    fodselsnr: string;
    innsatsgruppe: string;
    utfall: string;
    erSynlig: boolean;
    antallNotater?: number;
    arkivert: boolean;
    arkivertTidspunkt: string | null;
    arkivertAv: string | null;
    aktørid?: string;
    midlertidigUtilgjengeligStatus: Tilgjengelighet;
}

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

export type Kandidattilstand = {
    markert: boolean;
    filtrertBort: boolean;
    visningsstatus: Visningsstatus;
};

type Kandidatnr = string;

export type Kandidattilstander = Record<Kandidatnr, Kandidattilstand>;
export type Kandidatnotater = Record<Kandidatnr, RemoteData<Notat[]>>;

export type KandidatIKandidatliste = Kandidat & {
    tilstand: Kandidattilstand;
    notater: RemoteData<Notat[]>;
    sms?: Sms;
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
