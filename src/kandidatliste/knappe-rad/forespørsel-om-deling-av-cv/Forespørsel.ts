import { AktørId } from '../../domene/Kandidat';

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
    tilstand: Exclude<TilstandPåForespørsel, TilstandPåForespørsel.HarSvart>;
    svar: null;
};

export type ForespørselOmDelingAvCv = {
    aktørId: string;
    stillingsId: string;
    deltStatus: ForespørselDeltStatus;
    deltTidspunkt: string;
    deltAv: string;
    svarfrist: string;
} & (MedSvar | UtenSvar);

export enum TilstandPåForespørsel {
    KanIkkeOpprette = 'KAN_IKKE_OPPRETTE',
    PrøverVarsling = 'PROVER_VARSLING',
    HarVarslet = 'HAR_VARSLET',
    KanIkkeVarsle = 'KAN_IKKE_VARSLE',
    HarSvart = 'HAR_SVART',
    Avbrutt = 'AVBRUTT',
}

export const separerGjeldendeForespørselFraRespons = (
    forespørsler: Record<AktørId, ForespørselOmDelingAvCv[]>
): ForespørslerGruppertPåAktørId => {
    const gruppertPåAktørId = {};

    Object.entries(forespørsler).forEach(([aktørId, forespørsler]) => {
        const sorterteForespørsler = forespørsler.sort(
            (f1, f2) => new Date(f2.deltTidspunkt).getTime() - new Date(f1.deltTidspunkt).getTime()
        );

        gruppertPåAktørId[aktørId] = {
            gjeldendeForespørsel: sorterteForespørsler[0]!,
            forespørsler: forespørsler,
        };
    });

    return gruppertPåAktørId;
};

export type ForespørslerGruppertPåAktørId = Record<
    AktørId,
    {
        gjeldendeForespørsel: ForespørselOmDelingAvCv;
        forespørsler: ForespørselOmDelingAvCv[];
    }
>;

export type SvarPåForespørsel = {
    harSvartJa: boolean;
    svarTidspunkt: string;
    svartAv: {
        ident: string;
        identType: IdentType;
    };
};

export enum ForespørselDeltStatus {
    Sendt = 'SENDT',
    IkkeSendt = 'IKKE_SENDT',
}

export enum IdentType {
    AktørId = 'AKTOR_ID',
    NavIdent = 'NAV_IDENT',
}
