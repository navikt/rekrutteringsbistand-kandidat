import { Utfall } from './kandidatrad/utfall-select/UtfallSelect';
import { Status } from './kandidatrad/statusSelect/StatusSelect';
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

export interface Kandidat {
    kandidatId: string;
    kandidatnr: string;
    sisteArbeidserfaring: string;
    status: string;
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

export interface UsynligKandidat {
    fnr: string;
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
    utfall: Utfall;
    lagtTilTidspunkt: string;
    lagtTilAv: {
        ident: string;
        navn: string;
    };
    arkivert: boolean;
    // TODO: arkivertAv og arkivertTidspunkt?
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

export type Kandidatliste = {
    kandidatlisteId: string;
    tittel: string;
    beskrivelse: string;
    organisasjonReferanse: string;
    organisasjonNavn: string;
    stillingId: string;
    opprettetAv: OpprettetAv;
    opprettetTidspunkt: string;
    kanEditere: boolean;
    kanSlette: string;
    kandidater: Array<Kandidat>;
    usynligeKandidater: Array<UsynligKandidat>;
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
    status: Record<Status, boolean>;
    utfall: Record<Utfall, boolean>;
    navn: string;
};

export type Navn = {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
};

export type LagretKandidat = {
    kandidatnr: string;
    notat: string;
    sisteArbeidserfaring?: string;
};
