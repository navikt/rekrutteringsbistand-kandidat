import { Nettressurs } from '../../api/Nettressurs';
import { Fødselsnummer, Kandidatnr } from './Kandidat';

export type Notat = {
    tekst: string;
    notatId: string;
    lagtTilTidspunkt: string;
    notatEndret: boolean;
    kanEditere: boolean;
    lagtTilAv: {
        navn: string;
        ident: string;
    };
};

export enum SmsStatus {
    IkkeSendt = 'IKKE_SENDT',
    UnderUtsending = 'UNDER_UTSENDING',
    Sendt = 'SENDT',
    Feil = 'FEIL',
}

export type Sms = {
    id: number;
    fnr: Fødselsnummer;
    opprettet: string;
    sendt: string;
    status: SmsStatus;
    navIdent: string;
    kandidatlisteId: string;
};

export type Kandidattilstand = {
    markert: boolean;
    filtrertBort: boolean;
    visningsstatus: Visningsstatus;
};

export enum Visningsstatus {
    SkjulPanel = 'SKJUL_PANEL',
    VisNotater = 'VIS_NOTATER',
    VisMerInfo = 'VIS_MER_INFO',
}

export type Kandidattilstander = Record<Kandidatnr, Kandidattilstand>;
export type Kandidatnotater = Record<Kandidatnr, Nettressurs<Notat[]>>;
export type Kandidatmeldinger = Record<Fødselsnummer, Sms>;
