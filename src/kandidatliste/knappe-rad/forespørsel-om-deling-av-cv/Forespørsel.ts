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
};

export type ForespørselOmDelingAvCv = {
    aktørId: string;
    deltStatus: ForespørselDeltStatus;
    deltTidspunkt: string;
    deltAv: string;
    svarfrist: string;
    brukerVarslet: boolean | null;
    aktivitetOpprettet: boolean | null;
} & (MedSvar | UtenSvar);

export enum StatusPåForespørsel {
    AltGikkBra = 'altGikkBra',
    KanIkkeSvarePåKortet = 'kanIkkeSvarePåKortet',
    VeilederKanSvare = 'veilederKanSvare',
    KortetBleIkkeOpprettet = 'kortetBleIkkeOpprettet',
}

export enum ForespørselDeltStatus {
    Sendt = 'SENDT',
    IkkeSendt = 'IKKE_SENDT',
}

export enum SvarPåDelingAvCv {
    IkkeSvart = 'IKKE_SVART',
    Ja = 'JA',
    Nei = 'NEI',
}
