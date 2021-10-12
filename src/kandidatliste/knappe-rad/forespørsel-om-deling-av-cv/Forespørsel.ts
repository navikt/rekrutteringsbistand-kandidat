import { AktørId } from '../../domene/Kandidat';

export type ForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
    aktorIder: string[];
};

export type ResendForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
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

export const hentForespørselForKandidat = (
    aktørId: AktørId | null,
    forespørslerOmDelingAvCv: ForespørslerGruppertPåAktørId
): ForespørselOmDelingAvCv | undefined => {
    return aktørId === null ? undefined : forespørslerOmDelingAvCv[aktørId]?.gjeldendeForespørsel;
};

export const kanResendeForespørsel = (gjeldendeForespørsel: ForespørselOmDelingAvCv) => {
    const erAvbrutt = gjeldendeForespørsel.tilstand === TilstandPåForespørsel.Avbrutt;
    const noeFeilSkjedde = gjeldendeForespørsel.tilstand === TilstandPåForespørsel.KanIkkeOpprette;
    const harSvartNei =
        gjeldendeForespørsel.tilstand === TilstandPåForespørsel.HarSvart &&
        gjeldendeForespørsel.svar.harSvartJa === false;

    return erAvbrutt || harSvartNei || noeFeilSkjedde;
};

export type ForespørslerGruppertPåAktørId = {
    [s: string]: {
        gjeldendeForespørsel: ForespørselOmDelingAvCv;
        forespørsler: ForespørselOmDelingAvCv[];
    };
};

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
