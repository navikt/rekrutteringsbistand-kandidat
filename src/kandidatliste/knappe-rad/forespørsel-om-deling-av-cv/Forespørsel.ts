export type ForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
    aktorIder: string[];
};

type MedSvar = {
    svar: SvarPåDelingAvCv.Ja | SvarPåDelingAvCv.Nei;
    svarTidspunkt: string;
};

type UtenSvar = {
    svar: SvarPåDelingAvCv.IkkeSvart;
    svarTidspunkt: null;
};

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
