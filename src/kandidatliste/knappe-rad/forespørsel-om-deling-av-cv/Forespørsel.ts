export type ForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
    aktorIder: string[];
};

type MedSvar = {
    tilstand: TilstandPåForespørsel.HarSvart;
    svar: SvarPåForespørsel;
};

type UtenSvar = {
    tilstand: Omit<TilstandPåForespørsel, TilstandPåForespørsel.HarSvart>;
    svar: null;
};

export type ForespørselOmDelingAvCv = {
    aktørId: string;
    deltStatus: ForespørselDeltStatus;
    deltTidspunkt: string;
    deltAv: string;
    svarfrist: string;
} & (MedSvar | UtenSvar);

export enum StatusPåForespørsel {
    AltGikkBra = 'altGikkBra',
    KanIkkeSvarePåKortet = 'kanIkkeSvarePåKortet',
    VeilederKanSvare = 'veilederKanSvare',
    KortetBleIkkeOpprettet = 'kortetBleIkkeOpprettet',
    UgyldigStatus = 'ugyldigStatus',
    IngenRespons = 'ingenRespons',
}

export enum ForespørselDeltStatus {
    Sendt = 'SENDT',
    IkkeSendt = 'IKKE_SENDT',
}

export type SvarPåForespørsel = {
    svar: boolean;
    svarTidspunkt: string;
    svartAv: {
        ident: string;
        identType: IdentType;
    };
};

export enum IdentType {
    AktørId = 'AKTOR_ID',
    NavIdent = 'NAV_IDENT',
}

export enum TilstandPåForespørsel {
    KanIkkeOpprette = 'KAN_IKKE_OPPRETTE',
    PrøverVarsling = 'PROVER_VARSLING',
    HarVarslet = 'HAR_VARSLET',
    KanIkkeVarsle = 'KAN_IKKE_VARSLE',
    HarSvart = 'HAR_SVART',
    SvarfristUtløpt = 'SVARFRIST_UTLOPT',
}
