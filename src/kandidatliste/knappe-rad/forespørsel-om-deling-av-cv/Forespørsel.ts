export type ForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
    aktorIder: string[];
};

export type ForespørselOmDelingAvCv = {
    aktørId: string;
    deltStatus: ForespørselDeltStatus; // TODO: Alltid anta at sending på Kafka gikk bra?
    deltTidspunkt: Date;
    deltAv: string;
    svarfrist: Date;
    svar: SvarPåDelingAvCv;
    svarTidspunkt: Date | null;
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
