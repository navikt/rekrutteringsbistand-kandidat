import { FormidlingAvUsynligKandidat, Kandidat } from './Kandidat';

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
    kandidater: Kandidat[];
    formidlingerAvUsynligKandidat: FormidlingAvUsynligKandidat[];
    status: Kandidatlistestatus;
    antallStillinger: number | null;
    stillingskategori: Stillingskategori | null;
};

export type KandidatlisteSammendrag = Omit<
    Kandidatliste,
    'kandidater' | 'formidlingerAvUsynligKandidat'
> & {
    antallKandidater: number;
    antallUsynligeKandidater: number;
};

export enum Kandidatlistestatus {
    Åpen = 'ÅPEN',
    Lukket = 'LUKKET',
}

export enum Stillingskategori {
    Stilling = 'STILLING',
    Formidling = 'FORMIDLING',
    Arbeidstrening = 'ARBEIDSTRENING',
}

export type OpprettetAv = {
    ident: string;
    navn: string;
};

export const erKobletTilStilling = (
    kandidatliste: Kandidatliste | KandidatlisteSammendrag
): boolean => kandidatliste.stillingId !== null;

export const erKobletTilArbeidsgiver = (kandidatliste: Kandidatliste): boolean =>
    kandidatliste.organisasjonReferanse !== null;

export const erEierAvKandidatlisten = (kandidatliste: Kandidatliste): boolean =>
    kandidatliste.kanEditere;
