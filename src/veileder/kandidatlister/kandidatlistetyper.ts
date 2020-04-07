import { RemoteData } from '../../felles/common/remoteData';

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

export interface KandidatResponse {
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
    arkivertTidspunkt?: string;
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

interface KandidatExtension {
    notater: RemoteData<Array<Notat>>;
}

export type Kandidat = KandidatResponse & KandidatExtension;

export type Kandidattilstand = {
    markert: boolean;
    visningsstatus: string;
    sms?: Sms;
};

export type KandidatIKandidatliste = Kandidat & Kandidattilstand;

export type OpprettetAv = {
    ident: string;
    navn: string;
};

interface KandidatlisteBase {
    kandidatlisteId: string;
    tittel: string;
    beskrivelse: string;
    organisasjonReferanse: string;
    organisasjonNavn: string;
    stillingId: string;
    opprettetAv: OpprettetAv;
    opprettetTidspunkt: string;
    kanEditere: boolean;
}

interface KandidatlisteResponseExtension {
    kandidater: Array<KandidatResponse>;
}

interface KandidatlisteExtension {
    kandidater: Array<Kandidat>;
}

export type KandidatlisteResponse = KandidatlisteBase & KandidatlisteResponseExtension;

export type Kandidatliste = KandidatlisteBase & KandidatlisteExtension;
