import { ForespørslerForStillingInboundDto } from '../../../api/forespørselOmDelingAvCvApi';
import { AktørId } from '../../domene/Kandidat';

export type ForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
    aktorIder: string[];
    navKontor: string;
};

export type ResendForespørselOutboundDto = {
    stillingsId: string;
    svarfrist: Date;
    navKontor: string;
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
    navKontor: string;
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
    forespørsler: ForespørslerForStillingInboundDto
): ForespørslerGruppertPåAktørId => {
    const gruppertPåAktørId = {};

    Object.entries(forespørsler).forEach(([aktørId, forespørsler]) => {
        const sorterteForespørsler = [...(forespørsler || [])].sort(
            (f1, f2) => new Date(f1.deltTidspunkt).getTime() - new Date(f2.deltTidspunkt).getTime()
        );

        const gjeldendeForespørsel = sorterteForespørsler.pop();

        gruppertPåAktørId[aktørId] = {
            gjeldendeForespørsel,
            gamleForespørsler: sorterteForespørsler,
        };
    });

    return gruppertPåAktørId;
};

export const hentForespørslerForKandidatForStilling = (
    aktørId: AktørId | null,
    forespørslerOmDelingAvCv: ForespørslerGruppertPåAktørId
): ForespørslerForKandidatForStilling | undefined => {
    return aktørId === null ? undefined : forespørslerOmDelingAvCv[aktørId];
};

export const kanResendeForespørsel = (gjeldendeForespørsel: ForespørselOmDelingAvCv) => {
    const erAvbrutt = gjeldendeForespørsel.tilstand === TilstandPåForespørsel.Avbrutt;
    const noeFeilSkjedde = gjeldendeForespørsel.tilstand === TilstandPåForespørsel.KanIkkeOpprette;
    const harSvartNei =
        gjeldendeForespørsel.tilstand === TilstandPåForespørsel.HarSvart &&
        gjeldendeForespørsel.svar.harSvartJa === false;

    return erAvbrutt || harSvartNei || noeFeilSkjedde;
};

export type ForespørslerGruppertPåAktørId = Partial<
    Record<AktørId, ForespørslerForKandidatForStilling>
>;

export type ForespørslerForKandidatForStilling = {
    gjeldendeForespørsel: ForespørselOmDelingAvCv;
    gamleForespørsler: ForespørselOmDelingAvCv[];
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
