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
    kanSlette: KanSletteKandidatliste;
    kandidater: Kandidat[];
    formidlingerAvUsynligKandidat: FormidlingAvUsynligKandidat[];
    status: Kandidatlistestatus;
    antallStillinger: number | null;
    stillingskategori: Stillingskategori | null;
};

export enum KanSletteKandidatliste {
    KanSlettes = 'KAN_SLETTES',
    ErIkkeDin = 'ER_IKKE_DIN',
    HarStilling = 'HAR_STILLING',
    ErIkkeDinOgHarStilling = 'ER_IKKE_DIN_OG_HAR_STILLING',
}

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
    Jobbmesse = 'JOBBMESSE',
}

export type OpprettetAv = {
    ident: string;
    navn: string;
};

export const kandidaterMåGodkjenneDelingAvCv = (kandidatliste: Kandidatliste) => {
    return (
        (kandidatliste.stillingskategori === Stillingskategori.Stilling ||
            kandidatliste.stillingskategori === null) &&
        kandidatliste.stillingId !== null
    );
};

export const erKobletTilStilling = (
    kandidatliste: Kandidatliste | KandidatlisteSammendrag
): boolean => kandidatliste.stillingId !== null;

export const erKobletTilArbeidsgiver = (kandidatliste: Kandidatliste): boolean =>
    kandidatliste.organisasjonReferanse !== null;

export const erEierAvKandidatlisten = (kandidatliste: Kandidatliste): boolean =>
    kandidatliste.kanEditere;
