import { Kandidatforespørsler } from '../domene/Kandidatressurser';
import {
    StatusPåForespørsel,
    ForespørselOmDelingAvCv,
    SvarPåDelingAvCv,
} from '../knappe-rad/forespørsel-om-deling-av-cv/Forespørsel';

export const useStatusPåForespørsler = (
    forespørslerOmDelingAvCv: Kandidatforespørsler
): Record<StatusPåForespørsel, ForespørselOmDelingAvCv[]> => {
    const forespørsler = Object.values(forespørslerOmDelingAvCv);

    const brukereDerAltGikkBra = forespørsler.filter(tolkningAvSvarFraAktivitetsplanen.altGikkBra);

    const brukereDerKortetIkkeBleOpprettet = forespørsler.filter(
        tolkningAvSvarFraAktivitetsplanen.kortetBleIkkeOpprettet
    );

    const brukereSomIkkeKanSvarePåKortet = forespørsler.filter(
        tolkningAvSvarFraAktivitetsplanen.kanIkkeSvarePåKortet
    );

    const brukereVeilederKanSvarePåVegneAv = brukereSomIkkeKanSvarePåKortet.filter(
        (forespørsel) => forespørsel.svar === SvarPåDelingAvCv.IkkeSvart
    );

    return {
        [StatusPåForespørsel.AltGikkBra]: brukereDerAltGikkBra,
        [StatusPåForespørsel.KanIkkeSvarePåKortet]: brukereSomIkkeKanSvarePåKortet,
        [StatusPåForespørsel.KortetBleIkkeOpprettet]: brukereDerKortetIkkeBleOpprettet,
        [StatusPåForespørsel.VeilederKanSvare]: brukereVeilederKanSvarePåVegneAv,
    };
};

const tolkningAvSvarFraAktivitetsplanen: Record<
    StatusPåForespørsel,
    (forespørsel: ForespørselOmDelingAvCv) => boolean
> = {
    [StatusPåForespørsel.AltGikkBra]: ({ brukerVarslet, aktivitetOpprettet }) =>
        brukerVarslet === true && aktivitetOpprettet === true,
    [StatusPåForespørsel.KortetBleIkkeOpprettet]: ({ brukerVarslet, aktivitetOpprettet }) =>
        brukerVarslet === false && aktivitetOpprettet === false,
    [StatusPåForespørsel.KanIkkeSvarePåKortet]: ({ brukerVarslet, aktivitetOpprettet }) =>
        brukerVarslet === false && aktivitetOpprettet === true,
    [StatusPåForespørsel.VeilederKanSvare]: ({ brukerVarslet, aktivitetOpprettet, svar }) =>
        brukerVarslet === false &&
        aktivitetOpprettet === true &&
        svar === SvarPåDelingAvCv.IkkeSvart,
};

export default useStatusPåForespørsler;
