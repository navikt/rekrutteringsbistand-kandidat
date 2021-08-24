export type ForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
    aktorIder: string[];
};

type MedSvar = {
    svar: SvarPåDelingAvCv.Ja | SvarPåDelingAvCv.Nei;
    svarTidspunkt: string;
    brukerVarslet: boolean;
    aktivitetOpprettet: boolean;
};

type UtenSvar = {
    svar: SvarPåDelingAvCv.IkkeSvart;
    svarTidspunkt: null;
    brukerVarslet: null;
    aktivitetOpprettet: null;
};

// TODO: Fiks typer. Man kan ha fått brukerVarslet og aktivitetOpprettet selv om brukeren ikke har svart.
export type ForespørselOmDelingAvCv = {
    aktørId: string;
    deltStatus: ForespørselDeltStatus;
    deltTidspunkt: string;
    deltAv: string;
    svarfrist: string;
} & (MedSvar | UtenSvar);

export enum ForespørselDeltStatus {
    Sendt = 'SENDT',
    IkkeSendt = 'IKKE_SENDT',
}

export enum SvarPåDelingAvCv {
    IkkeSvart = 'IKKE_SVART',
    Ja = 'JA',
    Nei = 'NEI',
}
