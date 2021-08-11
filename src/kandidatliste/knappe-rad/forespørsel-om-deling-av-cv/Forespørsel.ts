export type ForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
    aktorIder: string[];
};

export type ForespørselOmDelingAvCv = {
    aktørId: string;
    deltStatus: ForespørselDeltStatus;
    deltTidspunkt: string;
    deltAv: string;
    svarfrist: string;
    svar: SvarPåDelingAvCv;
    svarTidspunkt: string | null;
};

export enum ForespørselDeltStatus {
    Sendt = 'SENDT',
    IkkeSendt = 'IKKE_SENDT',
}

export enum SvarPåDelingAvCv {
    IkkeSvart = 'IKKE_SVART',
    Ja = 'JA',
    Nei = 'NEI',
}
