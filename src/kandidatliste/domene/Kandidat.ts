import { Tilgjengelighet } from '../../kandidatside/cv/reducer/cv-typer';

export type Kandidatnr = string;
export type Fødselsnummer = string;
export type AktørId = string;

export type Kandidat = AktivKandidat | InaktivKandidat;

type AktivKandidat = Kandidatinformasjon & PersonaliaFraCv;
type InaktivKandidat = Kandidatinformasjon & IngenPersonaliaFraCv;

type Kandidatinformasjon = {
    kandidatnr: string;
    fornavn: string;
    etternavn: string;
    fodselsdato: string;
    status: Kandidatstatus;
    utfall: Kandidatutfall;
    antallNotater: number;
    lagtTilTidspunkt: string;
    lagtTilAv: LagtTilAv;
    arkivert: boolean;
    arkivertTidspunkt: string | null;
    arkivertAv: string | null;
    midlertidigUtilgjengeligStatus: Tilgjengelighet;
    erSynlig: boolean;
};

type PersonaliaFraCv = {
    fodselsnr: Fødselsnummer;
    aktørid: AktørId;
    epost: string | null;
    telefon: string | null;
    innsatsgruppe: string | null;
};

type IngenPersonaliaFraCv = {
    fodselsnr: null;
    aktørid: null;
    epost: null;
    telefon: null;
    innsatsgruppe: null;
};

export enum Kandidatstatus {
    Vurderes = 'VURDERES',
    Kontaktet = 'KONTAKTET',
    Aktuell = 'AKTUELL',
    TilIntervju = 'TIL_INTERVJU',
    Uaktuell = 'UAKTUELL',
    Uinteressert = 'UINTERESSERT',
}

export enum Kandidatutfall {
    IkkePresentert = 'IKKE_PRESENTERT',
    Presentert = 'PRESENTERT',
    FåttJobben = 'FATT_JOBBEN',
}

export type LagtTilAv = {
    ident: string;
    navn: string;
};

export type UsynligKandidat = {
    fornavn: string;
    mellomnavn: string | null;
    etternavn: string;
};

export type FormidlingAvUsynligKandidat = UsynligKandidat & {
    id: string;
    utfall: Kandidatutfall;
    lagtTilTidspunkt: string;
    lagtTilAvIdent: string;
    lagtTilAvNavn: string;
    arkivert: boolean;
    arkivertAvIdent: string | null;
    arkivertAvNavn: string | null;
    arkivertTidspunkt: string | null;
};

export const erInaktiv = (kandidat: Kandidat): boolean => kandidat.fodselsnr === null;
